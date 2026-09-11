import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Conditions Générales d’Utilisation — GhostPace Stealth Lab',
  description: 'Modalités d’utilisation du service de génération télémétrique GhostPace, responsabilités et conformité.',
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbfbf9]">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-[#fff2eb] text-[#fc5200] border border-[#ffd8c7]">
            <FileText className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#1d1d1f] sm:text-3xl">Conditions Générales d’Utilisation</h1>
            <p className="text-xs text-[#666660]">Dernière mise à jour : 11 Septembre 2026</p>
          </div>
        </div>

        <div className="mt-8 space-y-8 text-sm text-[#3d3d3f] leading-relaxed">
          <section className="rounded-2xl border border-[#e6e6e1] bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1d1d1f]">1. Objet du Service</h2>
            <p className="mt-2 text-xs text-[#666660]">
              GhostPace Stealth Lab fournit un outil de modélisation cinématique, d’interpolation altimétrique numérique 
              (modèles SRTM / Copernicus) et de génération de fichiers télémétriques au format standardisé GPX. 
              Le service est destiné à des fins de planification d’itinéraires, d’expérimentation sportive et de simulation de rythme.
            </p>
          </section>

          <section className="rounded-2xl border border-[#e6e6e1] bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1d1d1f]">2. Responsabilité de l’Utilisateur</h2>
            <p className="mt-2 text-xs text-[#666660]">
              L’utilisateur conserve l’entière responsabilité de l’usage fait des fichiers GPX générés et de leur exportation 
              vers des plateformes tierces (notamment Strava, Garmin Connect, Suunto ou Komoot). 
              L’utilisateur s’engage à respecter les chartes d’utilisation et les règles d’éthique sportive desdites plateformes, 
              notamment en marquant les activités comme privées ou non compétitives lorsqu’elles relèvent de la simulation.
            </p>
          </section>

          <section className="rounded-2xl border border-[#e6e6e1] bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1d1d1f]">3. Disponibilité & Limitation de Garantie</h2>
            <p className="mt-2 text-xs text-[#666660]">
              Le service est fourni « en l’état ». Bien que GhostPace s’efforce de garantir une disponibilité maximale 
              et une précision optimale des algorithmes physiologiques (GAP Minetti), aucune garantie de résultat 
              ou d’acceptation automatique par les serveurs tiers n’est formulée.
            </p>
          </section>

          <section className="rounded-2xl border border-[#e6e6e1] bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1d1d1f]">4. Propriété Intellectuelle</h2>
            <p className="mt-2 text-xs text-[#666660]">
              Les éléments constitutifs de l’interface, les algorithmes de lissage télémétrique et les éléments graphiques 
              sont la propriété exclusive de GhostPace Stealth Lab. Toute reproduction non autorisée est prohibée.
            </p>
          </section>

          <section className="rounded-2xl border border-[#e6e6e1] bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1d1d1f]">5. Droit Applicable</h2>
            <p className="mt-2 text-xs text-[#666660]">
              Les présentes conditions sont soumises au droit français. Tout litige relatif à leur interprétation 
              sera soumis à la compétence des juridictions compétentes.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
