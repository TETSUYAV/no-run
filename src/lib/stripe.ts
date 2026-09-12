import Stripe from 'stripe';
import { PricingProductId } from './types';

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export interface ProductConfig {
  id: PricingProductId;
  name: string;
  badge?: string;
  description: string;
  priceCents: number;
  credits: number;
  mode: 'payment' | 'subscription';
  interval?: 'month' | 'year';
  stripePriceId?: string; // Optional if using dynamic line_items
}

export const PRICING_PRODUCTS: Record<PricingProductId, ProductConfig> = {
  pack_3: {
    id: 'pack_3',
    name: 'Pack Alibi Express',
    badge: 'Idéal ce week-end',
    description: '3 tracés GPX complets, valables à vie sans engagement.',
    priceCents: 299,
    credits: 3,
    mode: 'payment',
    stripePriceId: process.env.STRIPE_PRICE_PACK_3,
  },
  pack_10: {
    id: 'pack_10',
    name: 'Pack Grasse Matinée',
    badge: 'Le plus populaire',
    description: '10 tracés GPX complets (0,70 € / tracé), valables à vie.',
    priceCents: 699,
    credits: 10,
    mode: 'payment',
    stripePriceId: process.env.STRIPE_PRICE_PACK_10,
  },
  pack_25: {
    id: 'pack_25',
    name: 'Pack Grand Chelem',
    badge: 'Meilleur tarif (-40%)',
    description: '25 tracés GPX complets (0,60 € / tracé), valables à vie.',
    priceCents: 1499,
    credits: 25,
    mode: 'payment',
    stripePriceId: process.env.STRIPE_PRICE_PACK_25,
  },
};
