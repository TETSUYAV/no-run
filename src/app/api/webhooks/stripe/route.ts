import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { addCredits, updateSubscription, getUserById } from '@/lib/userStore';

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ message: 'Stripe non configuré.' }, { status: 400 });
  }

  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error('Stripe webhook signature or secret missing');
    return NextResponse.json({ message: 'Signature ou secret manquant.' }, { status: 400 });
  }

  let event: any;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ message: `Webhook error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        const productId = session.metadata?.productId;
        const credits = parseInt(session.metadata?.credits || '0', 10);
        const customerId = session.customer as string;

        if (userId) {
          if (session.mode === 'payment') {
            // Achat de pack de crédits à vie
            await addCredits(userId, credits);
            console.log(`[Stripe Webhook] ${credits} crédits ajoutés à l'utilisateur ${userId}`);
          } else if (session.mode === 'subscription') {
            // Rétrocompatibilité abonnement
            await updateSubscription(userId, {
              status: 'active',
              plan: productId,
              stripeCustomerId: customerId,
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            });
            await addCredits(userId, 30);
            console.log(`[Stripe Webhook] Abonnement activé + 30 crédits pour ${userId}`);
          }
        }
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
