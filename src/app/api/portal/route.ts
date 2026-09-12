import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { verifySessionToken, getUserById } from '@/lib/userStore';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('norun_session')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ message: 'Session invalide.' }, { status: 401 });
    }

    const user = await getUserById(payload.userId);
    if (!user || !user.stripeCustomerId) {
      return NextResponse.json({ message: 'Aucun compte Stripe associé.' }, { status: 400 });
    }

    if (!stripe) {
      return NextResponse.json({ message: 'Stripe non configuré.' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${origin}/pricing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err: any) {
    console.error('Portal error:', err);
    return NextResponse.json({ message: 'Erreur portail Stripe' }, { status: 500 });
  }
}
