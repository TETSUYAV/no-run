import { NextRequest, NextResponse } from 'next/server';
import {
  createOrGetUser,
  getUserById,
  createSessionToken,
  verifySessionToken,
} from '@/lib/userStore';
import { isValidEmailFormat, isDisposableEmail } from '@/lib/emailValidation';

// Rate limiting IP pour la connexion/création de compte (max 15 requêtes / min par IP)
const authIpCounts = new Map<string, { count: number; resetTime: number }>();

function checkAuthRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = authIpCounts.get(ip);
  if (!entry || now > entry.resetTime) {
    authIpCounts.set(ip, { count: 1, resetTime: now + 60_000 });
    return true;
  }
  if (entry.count >= 15) {
    return false;
  }
  entry.count += 1;
  return true;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('norun_session')?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    const res = NextResponse.json({ authenticated: false, user: null });
    res.cookies.delete('norun_session');
    return res;
  }

  const user = await getUserById(payload.userId);
  if (!user) {
    const res = NextResponse.json({ authenticated: false, user: null });
    res.cookies.delete('norun_session');
    return res;
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      credits: user.credits,
      freeTrialAvailable: user.freeTrialAvailable,
      subscription: user.subscription,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    if (!checkAuthRateLimit(ip)) {
      return NextResponse.json(
        { message: 'Trop de tentatives de connexion. Veuillez patienter une minute.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const body = await req.json();
    const email = body.email?.trim().toLowerCase();

    if (!email || !isValidEmailFormat(email)) {
      return NextResponse.json(
        { message: 'Veuillez renseigner une adresse email valide (ex: contact@exemple.fr).' },
        { status: 400 }
      );
    }

    if (isDisposableEmail(email)) {
      return NextResponse.json(
        { message: 'Les adresses email temporaires ou jetables ne sont pas autorisées.' },
        { status: 400 }
      );
    }

    const { user, isNew } = await createOrGetUser(email);
    const token = createSessionToken(user);

    const res = NextResponse.json({
      success: true,
      isNew,
      user: {
        id: user.id,
        email: user.email,
        credits: user.credits,
        freeTrialAvailable: user.freeTrialAvailable,
        subscription: user.subscription,
      },
    });

    res.cookies.set('norun_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 jours
    });

    return res;
  } catch (err: any) {
    console.error('Auth error:', err);
    return NextResponse.json(
      { message: 'Erreur lors de l’authentification.' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete('norun_session');
  return res;
}
