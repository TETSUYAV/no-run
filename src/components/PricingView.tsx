'use client';

import * as React from 'react';
import Link from 'next/link';
import { Check, Sparkles, ArrowRight, Gift, Zap, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AuthModal } from '@/components/AuthModal';
import { PricingProductId } from '@/lib/types';

export function PricingView() {
  const [user, setUser] = React.useState<any>(null);
  const [loadingProduct, setLoadingProduct] = React.useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const [pendingProduct, setPendingProduct] = React.useState<PricingProductId | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch('/api/auth')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const triggerCheckout = async (productId: PricingProductId, currentUser?: any) => {
    const activeUser = currentUser || user;
    if (!activeUser) {
      setPendingProduct(productId);
      setAuthModalOpen(true);
      return;
    }

    setLoadingProduct(productId);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          email: activeUser.email,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erreur d’accès à la caisse.');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
      setLoadingProduct(null);
    }
  };

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="notion-card inline-flex items-center gap-1.5 px-3 py-1 text-xs text-[#787774]">
          <Sparkles className="size-3.5 text-[#fc5200]" />
          <span>100% Sans Abonnement • Paiement Unique</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#37352f] sm:text-4xl">
          Des crédits valables à vie. Zéro reconduction.
        </h1>
        <p className="mt-3 text-sm text-[#787774] leading-relaxed">
          Pas de prélèvement mensuel surprise ni de compte à résilier. 
          Vous achetez vos crédits une fois, et vous les utilisez quand vous voulez.
        </p>
      </div>

      {error && (
        <div className="mt-4 max-w-md mx-auto p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 text-center">
          {error}
        </div>
      )}

      {/* Grille des 3 Packs */}
      <div className="mt-12 grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto items-stretch">
        {/* Pack 3 */}
        <div className="relative flex flex-col justify-between rounded-2xl border border-[#e8e7e3] bg-white p-7 shadow-sm transition-all hover:shadow-md">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#787774]">
                Alibi Express
              </span>
              <span className="rounded-full bg-[#f1f0ec] px-2.5 py-0.5 text-[10px] font-medium text-[#787774]">
                3 sorties
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-4xl font-bold tracking-tight text-[#37352f] telemetry-mono">
                2,99 €
              </span>
              <span className="text-xs text-[#787774]">paiement unique</span>
            </div>
            <p className="mt-1 text-xs text-[#fc5200] font-medium">
              Soit 1,00 € par tracé • Valable à vie
            </p>

            <ul className="mt-6 space-y-3 text-xs text-[#37352f]">
              <li className="flex items-center gap-2.5 font-medium">
                <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                <span><strong>3 exports GPX complets</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                <span>Zéro abonnement, zéro engagement</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                <span>Crédits conservés à vie</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                <span>Course, Vélo et Natation</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <Button
              onClick={() => triggerCheckout('pack_3')}
              disabled={loadingProduct === 'pack_3'}
              className="w-full h-11 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 bg-[#37352f] hover:bg-[#22211f] text-white transition-all shadow-sm"
            >
              {loadingProduct === 'pack_3' ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <span>Prendre le Pack 3 (2,99 €)</span>
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Pack 10 (Recommandé) */}
        <div className="relative flex flex-col justify-between rounded-2xl border-2 border-[#fc5200] bg-white p-7 shadow-xl scale-105 z-10">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#fc5200] px-3.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm whitespace-nowrap">
            Le Plus Choisi • -30%
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#fc5200]">
                Grasse Matinée
              </span>
              <span className="rounded-full bg-[#fff2eb] px-2.5 py-0.5 text-[10px] font-semibold text-[#fc5200]">
                10 sorties
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-4xl font-bold tracking-tight text-[#37352f] telemetry-mono">
                6,99 €
              </span>
              <span className="text-xs text-[#787774]">paiement unique</span>
            </div>
            <p className="mt-1 text-xs text-[#fc5200] font-semibold">
              Soit 0,70 € par tracé • Valable à vie
            </p>

            <ul className="mt-6 space-y-3 text-xs text-[#37352f]">
              <li className="flex items-center gap-2.5 font-medium">
                <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                <span><strong>10 exports GPX complets</strong></span>
              </li>
              <li className="flex items-center gap-2.5 font-medium">
                <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                <span>Crédits conservés indéfiniment</span>
              </li>
              <li className="flex items-center gap-2.5 font-medium">
                <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                <span>Toutes montres (Garmin, Apple Watch Ultra...)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                <span>Modélisation cardiaque et dénivelé SRTM</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <Button
              onClick={() => triggerCheckout('pack_10')}
              disabled={loadingProduct === 'pack_10'}
              className="w-full h-11 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 bg-[#fc5200] hover:bg-[#e04800] text-white transition-all shadow-md hover:shadow-lg"
            >
              {loadingProduct === 'pack_10' ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <span>Prendre le Pack 10 (6,99 €)</span>
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Pack 25 */}
        <div className="relative flex flex-col justify-between rounded-2xl border border-[#e8e7e3] bg-white p-7 shadow-sm transition-all hover:shadow-md">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#787774]">
                Grand Chelem
              </span>
              <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[10px] font-semibold">
                -40%
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-4xl font-bold tracking-tight text-[#37352f] telemetry-mono">
                14,99 €
              </span>
              <span className="text-xs text-[#787774]">paiement unique</span>
            </div>
            <p className="mt-1 text-xs text-emerald-700 font-semibold">
              Soit 0,60 € par tracé • Valable à vie
            </p>

            <ul className="mt-6 space-y-3 text-xs text-[#37352f]">
              <li className="flex items-center gap-2.5 font-medium">
                <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                <span><strong>25 exports GPX complets</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                <span>Le coût par tracé le plus bas du marché</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                <span>Valable à vie sans limite de temps</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                <span>Support prioritaire VIP</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <Button
              onClick={() => triggerCheckout('pack_25')}
              disabled={loadingProduct === 'pack_25'}
              className="w-full h-11 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 bg-[#37352f] hover:bg-[#22211f] text-white transition-all shadow-sm"
            >
              {loadingProduct === 'pack_25' ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <span>Prendre le Pack 25 (14,99 €)</span>
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Free Trial Banner */}
      <div className="mt-12 max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-[#fff5f0] to-[#fffaf7] p-6 border border-[#ffd8c7] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5 text-left">
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#fc5200] text-white shrink-0 shadow-sm">
            <Gift className="size-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#37352f]">
              Vous voulez tester avant de payer ?
            </h2>
            <p className="text-xs text-[#787774] mt-0.5">
              Votre <strong>1er tracé GPX est 100% offert</strong> sans carte bancaire pour vérifier qu’il s’importe parfaitement sur Strava.
            </p>
          </div>
        </div>
        <Button asChild size="sm" className="shrink-0 rounded-xl bg-[#fc5200] hover:bg-[#e04800] text-white text-xs font-semibold px-4 py-2">
          <Link href="/create">Essayer gratuitement</Link>
        </Button>
      </div>

      {/* Comparatif No Run vs Concurrents */}
      <div className="mt-14 max-w-4xl mx-auto">
        <h2 className="text-center text-lg font-bold text-[#37352f]">
          Pourquoi No Run face aux abonnements contraignants (Canaprun)
        </h2>
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#e8e7e3] bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf9f5] border-b border-[#e8e7e3] text-[#787774]">
              <tr>
                <th className="py-3 px-4 font-semibold">Critère</th>
                <th className="py-3 px-4 font-bold text-[#fc5200]">No Run</th>
                <th className="py-3 px-4 font-normal text-[#787774]">Autres générateurs (ex: Canaprun)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f0ec] text-[#37352f]">
              <tr>
                <td className="py-3 px-4 font-medium">Modèle économique</td>
                <td className="py-3 px-4 font-semibold text-emerald-600">✅ 100% Sans abonnement</td>
                <td className="py-3 px-4 text-[#787774]">❌ Abonnement mensuel forcé</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Validité des crédits</td>
                <td className="py-3 px-4 font-semibold text-emerald-600">✅ Valables à vie</td>
                <td className="py-3 px-4 text-[#787774]">❌ Crédits expirés à la fin du mois</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Essai gratuit</td>
                <td className="py-3 px-4 font-semibold text-emerald-600">✅ 1er tracé offert sans CB</td>
                <td className="py-3 px-4 text-[#787774]">❌ 0 export (CB obligatoire)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Régulation Minetti GAP</td>
                <td className="py-3 px-4 font-semibold text-emerald-600">✅ Ralentissement réaliste en côte</td>
                <td className="py-3 px-4 text-[#787774]">❌ Allure plate incohérente</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Paiement instantané</td>
                <td className="py-3 px-4 font-semibold text-emerald-600">✅ Apple Pay & Google Pay en 1 clic</td>
                <td className="py-3 px-4 text-[#787774]">Saisie CB manuelle</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(newUser) => {
          setUser(newUser);
          setAuthModalOpen(false);
          if (pendingProduct) {
            triggerCheckout(pendingProduct, newUser);
          }
        }}
      />
    </div>
  );
}
