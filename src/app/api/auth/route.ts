import { NextRequest, NextResponse } from 'next/server';
import {
  createOrGetUser,
  getUserById,
  createSessionToken,
  verifySessionToken,
} from '@/lib/userStore';

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
    const body = await req.json();
    const email = body.email?.trim().toLowerCase();

    if (!email || !email.includes('@') || email.length < 5) {
      return NextResponse.json(
        { message: 'Veuillez renseigner une adresse email valide.' },
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
