import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { processCompletedCheckoutSession, addCredits, updateSubscription } from '@/lib/userStore';

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ message: 'Stripe non configuré.' }, { status: 400 });
  }

  const signature = req.headers.get('stripe-signature');
  const rawSecrets = process.env.STRIPE_WEBHOOK_SECRET || '';

  if (!signature || !rawSecrets) {
    console.error('Stripe webhook signature or secret missing');
    return NextResponse.json({ message: 'Signature ou secret manquant.' }, { status: 400 });
  }

  const secrets = rawSecrets.split(',').map((s) => s.trim()).filter(Boolean);
  let event: any = null;
  let lastErr: any = null;

  try {
    const rawBody = await req.text();
    for (const secret of secrets) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, secret);
        break;
      } catch (err: any) {
        lastErr = err;
      }
    }
  } catch (err: any) {
    lastErr = err;
  }

  if (!event) {
    console.error('Webhook signature verification failed:', lastErr?.message);
    return NextResponse.json({ message: `Webhook error: ${lastErr?.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const result = await processCompletedCheckoutSession(session);
        console.log(
          `[Stripe Webhook] Session ${session.id} traitée. Idempotent: ${result.alreadyProcessed}, Crédits ajoutés: ${result.creditsAdded}`
        );
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        const customerId = invoice.customer as string;
        // Renouvellement mensuel : ajouter 30 crédits mensuels
        // (Le store peut retrouver le client via stripeCustomerId si besoin)
        console.log(`[Stripe Webhook] Renouvellement réussi pour le client ${customerId}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as any;
        console.log(`[Stripe Webhook] Abonnement résilié: ${sub.id}`);
        break;
      }

      default:
        // Ignore unhandled event types
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Error processing webhook event:', err);
    return NextResponse.json({ message: 'Erreur traitement webhook' }, { status: 500 });
  }
}
