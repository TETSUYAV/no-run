import { NextResponse } from 'next/server';
import { getStorageMode } from '@/lib/userStore';

export async function GET() {
  const storage = getStorageMode();
  const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);
  const stripeWebhookConfigured = Boolean(process.env.STRIPE_WEBHOOK_SECRET);
  const sessionConfigured = Boolean(
    process.env.SESSION_SECRET &&
    process.env.SESSION_SECRET !== 'norun-dev-secret-key-32-chars-long-min!'
  );

  return NextResponse.json({
    status: 'ok',
    app: 'No Run',
    storage,
    stripeConfigured,
    stripeWebhookConfigured,
    sessionConfigured,
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
}
