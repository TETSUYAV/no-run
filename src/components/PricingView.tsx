'use client';

import * as React from 'react';
import Link from 'next/link';
import { Check, Sparkles, ArrowRight, ShieldCheck, Gift, Zap, Crown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AuthModal } from '@/components/AuthModal';
import { PricingProductId } from '@/lib/types';

export function PricingView() {
  const [tab, setTab] = React.useState<'packs' | 'club'>('packs');
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

  const handleOpenPortal = async () => {
    setLoadingProduct('portal');
    try {
      const res = await fetch('/api/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.message || 'Portail indisponible');
      }
    } catch (err: any) {
      setError(err.message);
      setLoadingProduct(null);
    }
  };

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="notion-card inline-flex items-center gap-1.5 px-3 py-1 text-xs text-[#787774]">
          <Sparkles className="size-3.5 text-[#fc5200]" />
          <span>Grille Tarifaire Éthique & Sans Engagement</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#37352f] sm:text-4xl">
          Des crédits valables à vie. Zéro arnaque.
        </h1>
        <p className="mt-3 text-sm text-[#787774] leading-relaxed">
          Pourquoi payer un abonnement contraignant si vous n’avez besoin que d’un alibi ce week-end ?
          Sur No Run, <strong>vos crédits ne périment jamais</strong>.
        </p>
      </div>

      {/* Switch Toggle */}
      <div className="mt-8 flex justify-center">
        <div className="inline-flex rounded-2xl bg-[#f0eee6] p-1 border border-[#e5e3db] shadow-inner">
          <button
            type="button"
            onClick={() => setTab('packs')}
            className={`flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-semibold transition-all ${
              tab === 'packs'
                ? 'bg-white text-[#37352f] shadow-sm'
                : 'text-[#787774] hover:text-[#37352f]'
            }`}
          >
            <Zap className="size-3.5 text-[#fc5200]" />
            <span>Packs à l’acte (Sans engagement)</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('club')}
            className={`flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-semibold transition-all ${
              tab === 'club'
                ? 'bg-white text-[#37352f] shadow-sm'
                : 'text-[#787774] hover:text-[#37352f]'
            }`}
          >
            <Crown className="size-3.5 text-[#fc5200]" />
            <span>Club Alibi (Abonnement avec Rollover)</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 max-w-md mx-auto p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 text-center">
          {error}
        </div>
      )}

      {/* Plans Container */}
      <div className="mt-10 grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {tab === 'packs' ? (
          <>
            {/* Pack 3 */}
            <div className="relative flex flex-col justify-between rounded-2xl border border-[#e8e7e3] bg-white p-7 shadow-sm transition-all hover:shadow-md">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#787774]">
                    Alibi Express
                  </span>
                  <span className="rounded-full bg-[#f1f0ec] px-2.5 py-0.5 text-[11px] font-medium text-[#787774]">
                    Idéal ce week-end
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
                    <span>Vos crédits n’expirent <strong>jamais</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                    <span>Modélisation cardiaque & dénivelé SRTM réel</span>
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
            <div className="relative flex flex-col justify-between rounded-2xl border-2 border-[#fc5200] bg-white p-7 shadow-lg">
              <div className="absolute -top-3 right-6 rounded-full bg-[#fc5200] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                Le Plus Choisi • -30%
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#fc5200]">
                    Grasse Matinée
                  </span>
                  <span className="rounded-full bg-[#fff2eb] px-2.5 py-0.5 text-[11px] font-semibold text-[#fc5200]">
                    10 Alibis
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold tracking-tight text-[#37352f] telemetry-mono">
                    6,99 €
                  </span>
                  <span className="text-xs text-[#787774]">paiement unique</span>
                </div>
                <p className="mt-1 text-xs text-[#fc5200] font-medium">
                  Soit 0,70 € par tracé • Valable à vie
                </p>

                <ul className="mt-6 space-y-3 text-xs text-[#37352f]">
                  <li className="flex items-center gap-2.5 font-medium">
                    <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                    <span><strong>10 exports GPX complets</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5 font-medium">
                    <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                    <span>Crédits conservés indéfiniment sur votre compte</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-medium">
                    <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                    <span>Toutes montres GPS (Garmin, Apple Watch Ultra...)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                    <span>Support prioritaire</span>
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
          </>
        ) : (
          <>
            {/* Club Alibi Mensuel */}
            <div className="relative flex flex-col justify-between rounded-2xl border-2 border-[#fc5200] bg-white p-7 shadow-lg">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#fc5200]">
                    Club Alibi Mensuel
                  </span>
                  <span className="rounded-full bg-[#fff2eb] px-2.5 py-0.5 text-[11px] font-semibold text-[#fc5200]">
                    Sans engagement
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold tracking-tight text-[#37352f] telemetry-mono">
                    6,90 €
                  </span>
                  <span className="text-xs text-[#787774]">/ mois</span>
                </div>
                <p className="mt-1 text-xs text-[#787774]">
                  30 tracés chaque mois avec <strong>report des crédits non utilisés</strong>
                </p>

                <ul className="mt-6 space-y-3 text-xs text-[#37352f]">
                  <li className="flex items-center gap-2.5 font-medium">
                    <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                    <span><strong>30 exports par mois</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5 font-medium">
                    <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                    <span><strong>Garantie Rollover</strong> : les crédits non utilisés se reportent !</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                    <span>Algorithme physiologique Minetti GAP anti-flag</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                    <span>Résiliation en 1 clic sans justification</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                {user?.subscription?.status === 'active' ? (
                  <Button
                    onClick={handleOpenPortal}
                    disabled={loadingProduct === 'portal'}
                    className="w-full h-11 text-xs font-bold uppercase tracking-wider rounded-xl bg-zinc-800 text-white"
                  >
                    Gérer mon abonnement Stripe
                  </Button>
                ) : (
                  <Button
                    onClick={() => triggerCheckout('club_monthly')}
                    disabled={loadingProduct === 'club_monthly'}
                    className="w-full h-11 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 bg-[#fc5200] hover:bg-[#e04800] text-white shadow-md hover:shadow-lg"
                  >
                    {loadingProduct === 'club_monthly' ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        <span>Rejoindre le Club (6,90 € / mois)</span>
                        <ArrowRight className="size-3.5" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Club Alibi Annuel */}
            <div className="relative flex flex-col justify-between rounded-2xl border border-[#e8e7e3] bg-white p-7 shadow-sm transition-all hover:shadow-md">
              <div className="absolute -top-3 right-6 rounded-full bg-emerald-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                2 mois offerts
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#787774]">
                    Club Alibi Annuel
                  </span>
                  <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[11px] font-medium">
                    59 € / an
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold tracking-tight text-[#37352f] telemetry-mono">
                    4,91 €
                  </span>
                  <span className="text-xs text-[#787774]">/ mois</span>
                </div>
                <p className="mt-1 text-xs text-[#787774]">
                  Facturé 59,00 € une fois par an • 360 alibis annuels
                </p>

                <ul className="mt-6 space-y-3 text-xs text-[#37352f]">
                  <li className="flex items-center gap-2.5 font-medium">
                    <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                    <span>Tracés illimités toute l’année</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                    <span>Accès anticipé aux nouvelles fonctionnalités</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="size-4 text-[#fc5200] stroke-[2.5]" />
                    <span>Support VIP direct WhatsApp / Email</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Button
                  onClick={() => triggerCheckout('club_yearly')}
                  disabled={loadingProduct === 'club_yearly'}
                  className="w-full h-11 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 bg-[#37352f] hover:bg-[#22211f] text-white shadow-sm"
                >
                  {loadingProduct === 'club_yearly' ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <span>Prendre l’Annuel (59 €)</span>
                      <ArrowRight className="size-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Free Trial Banner */}
      <div className="mt-10 max-w-3xl mx-auto rounded-2xl bg-gradient-to-r from-[#fff5f0] to-[#fffaf7] p-6 border border-[#ffd8c7] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
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
      <div className="mt-14 max-w-3xl mx-auto">
        <h2 className="text-center text-lg font-bold text-[#37352f]">
          Pourquoi No Run est plébiscité face aux autres générateurs
        </h2>
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#e8e7e3] bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf9f5] border-b border-[#e8e7e3] text-[#787774]">
              <tr>
                <th className="py-3 px-4 font-semibold">Fonctionnalité</th>
                <th className="py-3 px-4 font-bold text-[#fc5200]">No Run</th>
                <th className="py-3 px-4 font-normal text-[#787774]">Autres générateurs (ex: Canaprun)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f0ec] text-[#37352f]">
              <tr>
                <td className="py-3 px-4 font-medium">Validité des crédits</td>
                <td className="py-3 px-4 font-semibold text-emerald-600">✅ Valables à vie</td>
                <td className="py-3 px-4 text-[#787774]">❌ Perdus à la fin du mois</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Essai gratuit</td>
                <td className="py-3 px-4 font-semibold text-emerald-600">✅ 1er tracé offert sans CB</td>
                <td className="py-3 px-4 text-[#787774]">❌ 0 export (paywall obligatoire)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Engagement</td>
                <td className="py-3 px-4 font-semibold text-emerald-600">✅ Achat à l’acte ou abonnement</td>
                <td className="py-3 px-4 text-[#787774]">❌ Abonnement obligatoire</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Régulation Minetti GAP</td>
                <td className="py-3 px-4 font-semibold text-emerald-600">✅ Ralentissement réaliste en côte</td>
                <td className="py-3 px-4 text-[#787774]">❌ Allure plate incohérente</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Moyens de paiement</td>
                <td className="py-3 px-4 font-semibold text-emerald-600">✅ Apple Pay, Google Pay, CB</td>
                <td className="py-3 px-4 text-[#787774]">Carte bancaire classique</td>
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
