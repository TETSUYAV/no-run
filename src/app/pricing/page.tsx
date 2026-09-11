import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Button } from '@/components/ui/Button';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Tarifs & Accès — No Run',
  description: 'Générez des faux tracés Strava ultra-réalistes sans courir et sans abonnement.',
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f5]">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-14">
        {/* Notion document header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="notion-card inline-flex items-center gap-1.5 px-3 py-1 text-xs text-[#787774]">
            <Sparkles className="size-3.5 text-[#fc5200]" />
            <span>Document Public • Protocole Ouvert</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#37352f] sm:text-4xl">
            Télémétrie Furtive & Accès Illimité
          </h1>
          <p className="mt-3 text-sm text-[#787774] leading-relaxed">
            No Run met à disposition tous ses algorithmes de régulation GAP Minetti,
            d’altimétrie satellitaire SRTM et d’export GPX sans carte bancaire ni abonnement.
          </p>
        </div>

        {/* Notion callout box */}
        <div className="mt-8 max-w-3xl mx-auto notion-callout p-4 flex items-start gap-3">
          <ShieldCheck className="size-5 text-[#fc5200] shrink-0 mt-0.5" />
          <div className="text-xs text-[#37352f] leading-relaxed">
            <strong>Éthique & Transparence</strong> : Aucun paywall ni bridage de fréquence. Le studio No Run fonctionne
            directement dans votre navigateur et garantit la conformité de l’allure moyenne une fois importée sur Strava.
          </div>
        </div>

        {/* Notion comparison cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          {/* Plan No Run Libre */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border-2 border-[#fc5200] bg-white p-7 shadow-md">
            <div className="absolute top-0 right-0 rounded-bl-lg bg-[#fc5200] px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Actif & Gratuit
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base">🛋️</span>
                <h2 className="text-lg font-bold text-[#37352f]">No Run Libre</h2>
              </div>
              <p className="mt-1.5 text-xs text-[#787774]">
                Moteur de précision sportive complet, sans quota ni filigrane.
              </p>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="text-4xl font-bold tracking-tight text-[#37352f] telemetry-mono">0 €</span>
                <span className="text-xs text-[#787774]">/ à vie</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-[#37352f]">
                <li className="flex items-center gap-2.5 font-medium">
                  <div className="flex size-4 items-center justify-center rounded-full bg-[#fff2eb] text-[#fc5200]">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                  <span>Exports GPX illimités & sans compte</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <div className="flex size-4 items-center justify-center rounded-full bg-[#fff2eb] text-[#fc5200]">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                  <span>Calibration bi-passe stricte (allure exacte sur Strava)</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <div className="flex size-4 items-center justify-center rounded-full bg-[#fff2eb] text-[#fc5200]">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                  <span>Régulation physiologique Minetti GAP anti-record indésirable</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <div className="flex size-4 items-center justify-center rounded-full bg-[#fff2eb] text-[#fc5200]">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                  <span>Modèle altimétrique numérique réel (SRTM / Copernicus)</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <div className="flex size-4 items-center justify-center rounded-full bg-[#fff2eb] text-[#fc5200]">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                  <span>Signatures Garmin, Coros, Apple Watch (avec cadence)</span>
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Button asChild size="lg" className="w-full text-xs font-bold uppercase tracking-wider rounded-xl">
                <Link href="/create" className="flex items-center justify-center gap-2">
                  <span>Tracer une activité</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Comparatif Paywall tiers */}
          <div className="flex flex-col justify-between rounded-xl border border-[#e9e8e4] bg-[#fafaf8] p-7 opacity-75">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base">🔒</span>
                <h2 className="text-lg font-semibold text-[#37352f]">Générateurs à Abonnement</h2>
              </div>
              <p className="mt-1.5 text-xs text-[#787774]">
                Modèles payants traditionnels du marché (ex: Canaprun original).
              </p>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="text-4xl font-bold tracking-tight text-[#787774] telemetry-mono">4,99 €</span>
                <span className="text-xs text-[#787774]">/ mois</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-[#787774]">
                <li className="flex items-center gap-2.5">
                  <span className="text-[#9b9a97]">•</span>
                  <span>Limité à 5 exports mensuels</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#9b9a97]">•</span>
                  <span>Carte bancaire obligatoire</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#9b9a97]">•</span>
                  <span>Allure moyenne faussée sur Strava par le relief</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#9b9a97]">•</span>
                  <span>Pas de modélisation biomécanique continue</span>
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Button variant="outline" asChild size="lg" className="w-full text-xs font-semibold uppercase tracking-wider rounded-xl">
                <Link href="/create">Accéder au Studio Libre</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
