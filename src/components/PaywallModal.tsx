'use client';

import { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, Loader2, Zap, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';
import { PricingProductId } from '@/lib/types';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export function PaywallModal({ isOpen, onClose, userEmail }: PaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PricingProductId>('pack_10');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async (productId: PricingProductId) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          email: userEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erreur lors de l’initialisation du paiement.');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-[#faf9f5] p-6 sm:p-8 shadow-2xl border border-[#e9e8e4] text-[#37352f]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-full text-[#787774] hover:bg-[#eae8e1] hover:text-[#37352f] transition-colors"
          aria-label="Fermer"
        >
          <X className="size-5" />
        </button>

        <div className="text-center">
          <div className="notion-card inline-flex items-center gap-1.5 px-3 py-1 text-xs text-[#787774]">
            <Sparkles className="size-3.5 text-[#fc5200]" />
            <span>Votre alibi Strava est prêt</span>
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#37352f]">
            Rechargez vos crédits No Run
          </h2>
          <p className="mt-1.5 text-xs text-[#787774] max-w-md mx-auto leading-relaxed">
            Contrairement à nos concurrents, <strong>vos crédits sont valables à vie</strong> et ne sont jamais confisqués à la fin du mois.
          </p>
        </div>

        {/* Grille des offres */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {/* Pack 3 */}
          <div
            onClick={() => setSelectedPlan('pack_3')}
            className={`relative flex flex-col justify-between p-4 rounded-xl border cursor-pointer transition-all ${
              selectedPlan === 'pack_3'
                ? 'border-[#fc5200] bg-white shadow-md ring-2 ring-[#fc5200]/20'
                : 'border-[#e9e8e4] bg-white/70 hover:border-[#d3d1cb]'
            }`}
          >
            <div>
              <div className="text-xs font-semibold text-[#787774]">Alibi Express</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[#37352f] telemetry-mono">2,99 €</span>
              </div>
              <div className="text-[11px] text-[#787774] mt-0.5">3 tracés (1,00 € / tracé)</div>
              <ul className="mt-3 space-y-1.5 text-[11px] text-[#37352f]">
                <li className="flex items-center gap-1.5">
                  <Check className="size-3 text-[#fc5200] shrink-0" />
                  <span>Sans engagement</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="size-3 text-[#fc5200] shrink-0" />
                  <span>Valable à vie</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pack 10 (Recommandé) */}
          <div
            onClick={() => setSelectedPlan('pack_10')}
            className={`relative flex flex-col justify-between p-4 rounded-xl border cursor-pointer transition-all ${
              selectedPlan === 'pack_10'
                ? 'border-[#fc5200] bg-white shadow-lg ring-2 ring-[#fc5200]/20'
                : 'border-[#e9e8e4] bg-white/70 hover:border-[#d3d1cb]'
            }`}
          >
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#fc5200] text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
              Populaire
            </div>
            <div>
              <div className="text-xs font-semibold text-[#fc5200]">Grasse Matinée</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[#37352f] telemetry-mono">6,99 €</span>
              </div>
              <div className="text-[11px] text-[#787774] mt-0.5">10 tracés (0,70 € / tracé)</div>
              <ul className="mt-3 space-y-1.5 text-[11px] text-[#37352f]">
                <li className="flex items-center gap-1.5 font-medium">
                  <Check className="size-3 text-[#fc5200] shrink-0" />
                  <span>Économisez 30%</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="size-3 text-[#fc5200] shrink-0" />
                  <span>Valable à vie</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pack 25 */}
          <div
            onClick={() => setSelectedPlan('pack_25')}
            className={`relative flex flex-col justify-between p-4 rounded-xl border cursor-pointer transition-all ${
              selectedPlan === 'pack_25'
                ? 'border-[#fc5200] bg-white shadow-md ring-2 ring-[#fc5200]/20'
                : 'border-[#e9e8e4] bg-white/70 hover:border-[#d3d1cb]'
            }`}
          >
            <div>
              <div className="text-xs font-semibold text-[#787774]">Grand Chelem</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[#37352f] telemetry-mono">14,99 €</span>
              </div>
              <div className="text-[11px] text-[#787774] mt-0.5">25 tracés (0,60 € / tracé)</div>
              <ul className="mt-3 space-y-1.5 text-[11px] text-[#37352f]">
                <li className="flex items-center gap-1.5">
                  <Check className="size-3 text-[#fc5200] shrink-0" />
                  <span>Meilleur tarif (-40%)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="size-3 text-[#fc5200] shrink-0" />
                  <span>Valable à vie</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
            {error}
          </p>
        )}

        <div className="mt-6">
          <Button
            onClick={() => handleCheckout(selectedPlan)}
            disabled={loading}
            className="w-full h-12 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 bg-[#fc5200] hover:bg-[#e04800] text-white transition-all shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Connexion sécurisée à Stripe...</span>
              </>
            ) : (
              <>
                <span>
                  Débloquer avec{' '}
                  {selectedPlan === 'pack_3'
                    ? 'Alibi Express (2,99 €)'
                    : selectedPlan === 'pack_10'
                    ? 'Grasse Matinée (6,99 €)'
                    : 'Grand Chelem (14,99 €)'}
                </span>
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-[#787774]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="size-3.5 text-[#fc5200]" />
            Paiement Stripe chiffré
          </span>
          <span>•</span>
          <span>Apple Pay & Google Pay</span>
          <span>•</span>
          <span>Sans reconduction forcée sur les packs</span>
        </div>
      </div>
    </div>
  );
}
