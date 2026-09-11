import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Button } from '@/components/ui/Button';
import { Check, Sparkles, Zap } from 'lucide-react';

export const metadata = {
  title: 'Accès Illimité — GhostPace Stealth Lab',
  description: 'Générez des traces GPX furtives ultra-réalistes sans abonnement, calibrées pour Strava.',
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbfbf9]">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ffd8c7] bg-[#fff2eb] px-3.5 py-1 text-xs font-semibold text-[#fc5200] shadow-sm">
            <Sparkles className="size-3 text-[#fc5200]" />
            <span>Protocole Ouvert & Gratuit</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#1d1d1f] sm:text-4xl">
            Télémétrie Furtive & Accès Illimité
          </h1>
          <p className="mt-3 text-sm text-[#666660] max-w-lg mx-auto leading-relaxed">
            GhostPace met à disposition tous ses algorithmes de régulation GAP, d’altimétrie satellitaire
            et d’export GPX sans carte bancaire ni abonnement.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
          {/* Plan GhostPace */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-[#fc5200] bg-white p-8 shadow-[0_8px_30px_rgba(252,82,0,0.12)]">
            <div className="absolute top-0 right-0 rounded-bl-2xl bg-gradient-to-l from-[#eb4d00] to-[#fc5200] px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              Actif & Ouvert
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#fc5200]" />
                <h2 className="text-xl font-bold text-[#1d1d1f]">GhostPace Community</h2>
              </div>
              <p className="mt-2 text-xs text-[#666660]">
                Puissance totale de génération, sans quota ni filigrane.
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-[#1d1d1f]">0 €</span>
                <span className="text-xs text-[#666660]">/ à vie</span>
              </div>
              <ul className="mt-6 space-y-3.5 text-xs text-[#666660]">
                <li className="flex items-center gap-2.5 text-[#1d1d1f] font-medium">
                  <div className="flex size-4 items-center justify-center rounded-full bg-[#fff2eb] text-[#fc5200]">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                  <span>Exports GPX illimités & gratuits</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#1d1d1f] font-medium">
                  <div className="flex size-4 items-center justify-center rounded-full bg-[#fff2eb] text-[#fc5200]">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                  <span>Calibration bi-passe stricte (allure exacte sur Strava)</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#1d1d1f] font-medium">
                  <div className="flex size-4 items-center justify-center rounded-full bg-[#fff2eb] text-[#fc5200]">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                  <span>Régulation physiologique Minetti GAP anti-record indésirable</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#1d1d1f] font-medium">
                  <div className="flex size-4 items-center justify-center rounded-full bg-[#fff2eb] text-[#fc5200]">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                  <span>Modèle altimétrique numérique réel (SRTM / Copernicus)</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#1d1d1f] font-medium">
                  <div className="flex size-4 items-center justify-center rounded-full bg-[#fff2eb] text-[#fc5200]">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                  <span>Signatures Garmin, Coros, Apple Watch (avec cadence)</span>
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Button asChild size="lg" className="w-full text-xs font-bold uppercase tracking-wider">
                <Link href="/create">Générer une trace maintenant</Link>
              </Button>
            </div>
          </div>

          {/* Comparatif Paywall tiers */}
          <div className="flex flex-col justify-between rounded-3xl border border-[#e6e6e1] bg-white/70 p-8 shadow-sm opacity-60">
            <div>
              <h2 className="text-xl font-bold text-[#1d1d1f]">Générateurs à Abonnement</h2>
              <p className="mt-2 text-xs text-[#666660]">
                Modèles payants traditionnels du marché (ex: Canaprun original).
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-[#1d1d1f]">4,99 €</span>
                <span className="text-xs text-[#666660]">/ mois</span>
              </div>
              <ul className="mt-6 space-y-3.5 text-xs text-[#666660]">
                <li className="flex items-center gap-2.5">
                  <Check className="size-3.5 text-[#666660]" />
                  <span>Limité à 5 exports mensuels</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-3.5 text-[#666660]" />
                  <span>Carte bancaire obligatoire</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-3.5 text-[#666660]" />
                  <span>Allure moyenne souvent faussée par le D+</span>
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Button variant="outline" asChild size="lg" className="w-full text-xs font-semibold uppercase tracking-wider">
                <Link href="/create">Utiliser GhostPace Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
