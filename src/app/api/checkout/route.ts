import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICING_PRODUCTS } from '@/lib/stripe';
import { PricingProductId } from '@/lib/types';
import {
  getUserById,
  createOrGetUser,
  verifySessionToken,
  addCredits,
  processCompletedCheckoutSession,
} from '@/lib/userStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const productId: PricingProductId = body.productId;
    const product = PRICING_PRODUCTS[productId];

    if (!product) {
      return NextResponse.json({ message: 'Produit invalide.' }, { status: 400 });
    }

    // Identify user
    let user = null;
    const token = req.cookies.get('norun_session')?.value;
    if (token) {
      const payload = verifySessionToken(token);
      if (payload) {
        user = await getUserById(payload.userId);
      }
    }

    // If not logged in via cookie, allow email passed in body
    if (!user && body.email) {
      const email = body.email.trim().toLowerCase();
      const res = await createOrGetUser(email);
      user = res.user;
    }

    if (!user) {
      return NextResponse.json(
        { message: 'Veuillez renseigner votre email pour finaliser votre commande.' },
        { status: 401 }
      );
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // If Stripe is configured, create live Stripe Checkout Session
    if (stripe) {
      let lineItems: any[] = [];
      if (product.stripePriceId) {
        lineItems = [{ price: product.stripePriceId, quantity: 1 }];
      } else {
        lineItems = [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: product.name,
                description: product.description,
                tax_code: 'txcd_10000000', // SaaS / Biens numériques
              },
              unit_amount: product.priceCents,
            },
            quantity: 1,
          },
        ];
      }

      const session = await stripe.checkout.sessions.create({
        customer_email: user.email,
        mode: 'payment',
        line_items: lineItems,
        metadata: {
          userId: user.id,
          productId: product.id,
          credits: product.credits.toString(),
        },
        success_url: `${origin}/create?payment=success&product=${product.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/pricing?payment=cancelled`,
      });

      return NextResponse.json({ url: session.url });
    }

    // Fallback: Dev/Mock mode if Stripe keys are not yet configured in env
    console.warn('[No Run] Mode Démo / Dev : Pas de clé STRIPE_SECRET_KEY, simulation d’achat activée.');
    await addCredits(user.id, product.credits);

    return NextResponse.json({
      url: `${origin}/create?payment=mock_success&product=${product.id}`,
      mock: true,
    });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { message: err?.message || 'Erreur lors de la création de la session de paiement.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ message: 'session_id requis' }, { status: 400 });
    }

    if (!stripe) {
      return NextResponse.json({ message: 'Stripe non configuré' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      return NextResponse.json({ message: 'Session introuvable' }, { status: 404 });
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json({
        paid: false,
        status: session.payment_status,
      });
    }

    const result = await processCompletedCheckoutSession(session as any);

    return NextResponse.json({
      paid: true,
      processed: result.processed,
      alreadyProcessed: result.alreadyProcessed,
      creditsAdded: result.creditsAdded,
      user: result.user
        ? {
            id: result.user.id,
            email: result.user.email,
            credits: result.user.credits,
            freeTrialAvailable: result.user.freeTrialAvailable,
            subscription: result.user.subscription,
          }
        : null,
    });
  } catch (err: any) {
    console.error('Verify checkout error:', err);
    return NextResponse.json(
      { message: err?.message || 'Erreur lors de la vérification du paiement.' },
      { status: 500 }
    );
  }
}
