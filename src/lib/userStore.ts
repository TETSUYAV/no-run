import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Redis } from '@upstash/redis';
import { UserAccount, UserSubscription } from './types';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), '.data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSION_SECRET = process.env.SESSION_SECRET || 'norun-dev-secret-key-32-chars-long-min!';

// Upstash Redis / Vercel KV Client
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

export const redis = (redisUrl && redisToken)
  ? new Redis({ url: redisUrl, token: redisToken })
  : null;

export function getStorageMode(): 'redis' | 'disk' {
  return redis ? 'redis' : 'disk';
}

// In-memory fallback
let inMemoryUsers: Map<string, UserAccount> = new Map();

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // Ignore error in read-only / serverless environments
  }
}

function loadUsers(): Map<string, UserAccount> {
  try {
    ensureDataDir();
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, 'utf-8');
      const data: Record<string, UserAccount> = JSON.parse(raw);
      return new Map(Object.entries(data));
    }
  } catch (err) {
    console.warn('Could not read users.json, using in-memory store:', err);
  }
  return inMemoryUsers;
}

function saveUsers(usersMap: Map<string, UserAccount>) {
  try {
    inMemoryUsers = usersMap;
    ensureDataDir();
    const data: Record<string, UserAccount> = {};
    usersMap.forEach((val, key) => {
      data[key] = val;
    });
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write users.json, saved to memory only:', err);
  }
}

async function saveUserToStore(user: UserAccount): Promise<void> {
  if (redis) {
    await Promise.all([
      redis.set(`norun:user:${user.id}`, user),
      redis.set(`norun:email:${user.email.toLowerCase()}`, user.id),
    ]);
    return;
  }

  const users = loadUsers();
  users.set(user.id, user);
  saveUsers(users);
}

export async function getUserById(id: string): Promise<UserAccount | null> {
  if (redis) {
    try {
      const user = await redis.get<UserAccount>(`norun:user:${id}`);
      return user || null;
    } catch (err) {
      console.error('Redis getUserById error:', err);
    }
  }

  const users = loadUsers();
  return users.get(id) || null;
}

export async function getUserByEmail(email: string): Promise<UserAccount | null> {
  const normalized = email.trim().toLowerCase();

  if (redis) {
    try {
      const userId = await redis.get<string>(`norun:email:${normalized}`);
      if (userId) {
        return getUserById(userId);
      }
      return null;
    } catch (err) {
      console.error('Redis getUserByEmail error:', err);
    }
  }

  const users = loadUsers();
  let found: UserAccount | null = null;
  users.forEach((user) => {
    if (user.email.toLowerCase() === normalized) {
      found = user;
    }
  });
  return found;
}

export async function createOrGetUser(email: string): Promise<{ user: UserAccount; isNew: boolean }> {
  const normalized = email.trim().toLowerCase();
  const existing = await getUserByEmail(normalized);
  if (existing) {
    return { user: existing, isNew: false };
  }

  const id = 'usr_' + crypto.randomBytes(8).toString('hex');
  const newUser: UserAccount = {
    id,
    email: normalized,
    credits: 0,
    freeTrialAvailable: true, // 1er tracé offert à l'inscription
    subscription: {
      status: 'none',
      plan: null,
    },
    createdAt: new Date().toISOString(),
  };

  await saveUserToStore(newUser);
  return { user: newUser, isNew: true };
}

export async function addCredits(userId: string, amount: number): Promise<UserAccount | null> {
  const user = await getUserById(userId);
  if (!user) return null;

  user.credits = (user.credits || 0) + amount;
  await saveUserToStore(user);
  return user;
}

export async function updateSubscription(
  userId: string,
  subData: Partial<UserSubscription> & { stripeCustomerId?: string }
): Promise<UserAccount | null> {
  const user = await getUserById(userId);
  if (!user) return null;

  const currentSub: UserSubscription = user.subscription || {
    status: 'none',
    plan: null,
  };

  user.subscription = {
    status: subData.status ?? currentSub.status,
    plan: subData.plan !== undefined ? subData.plan : currentSub.plan,
    currentPeriodEnd: subData.currentPeriodEnd ?? currentSub.currentPeriodEnd,
  };

  if (subData.stripeCustomerId) {
    user.stripeCustomerId = subData.stripeCustomerId;
  }

  await saveUserToStore(user);
  return user;
}

export async function consumeExportCredit(userId: string): Promise<{
  success: boolean;
  reason: 'free_trial' | 'credit' | 'subscription' | 'insufficient_funds';
  user: UserAccount | null;
}> {
  const user = await getUserById(userId);
  if (!user) {
    return { success: false, reason: 'insufficient_funds', user: null };
  }

  // 1. Abonnement actif (rétrocompatibilité)
  if (user.subscription && user.subscription.status === 'active') {
    return { success: true, reason: 'subscription', user };
  }

  // 2. Essai gratuit disponible (1er export offert)
  if (user.freeTrialAvailable) {
    user.freeTrialAvailable = false;
    await saveUserToStore(user);
    return { success: true, reason: 'free_trial', user };
  }

  // 3. Crédits achetés via Packs
  if (user.credits > 0) {
    user.credits -= 1;
    await saveUserToStore(user);
    return { success: true, reason: 'credit', user };
  }

  // 4. Aucun crédit
  return { success: false, reason: 'insufficient_funds', user };
}

// Session Token Generation & Verification (HMAC-SHA256)
export function createSessionToken(user: UserAccount): string {
  const payload = JSON.stringify({
    uid: user.id,
    em: user.email,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 jours
  });
  const b64Payload = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(b64Payload)
    .digest('base64url');
  return `${b64Payload}.${signature}`;
}

export function verifySessionToken(token: string): { userId: string; email: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [b64Payload, signature] = parts;

    const expected = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(b64Payload)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return null;
    }

    const raw = Buffer.from(b64Payload, 'base64url').toString('utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.exp && parsed.exp < Date.now()) {
      return null;
    }
    return { userId: parsed.uid, email: parsed.em };
  } catch {
    return null;
  }
}
