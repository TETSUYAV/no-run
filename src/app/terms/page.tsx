import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Conditions Générales — No Run',
  description: 'Modalités d’utilisation du service No Run, responsabilités et conformité.',
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f5]">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-14">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#fff2eb] text-[#fc5200] border border-[#ffd8c7]">
            <FileText className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#37352f] sm:text-3xl">Conditions Générales d’Utilisation</h1>
            <p className="text-xs text-[#787774]">Document Public • Dernière mise à jour : 11 Septembre 2026</p>
          </div>
        </div>

        <div className="mt-8 space-y-6 text-sm text-[#37352f] leading-relaxed">
          <section className="notion-card p-6">
            <h2 className="text-base font-bold text-[#37352f]">1. Objet du Service</h2>
            <p className="mt-2 text-xs text-[#787774]">
              No Run fournit un outil de modélisation cinématique, d’interpolation altimétrique numérique 
              (modèles SRTM / Copernicus) et de génération de faux tracés télémétriques au format standardisé GPX. 
              Le service est destiné à des fins de planification d’itinéraires, de simulation sportive et d’enregistrement sans effort physique.
            </p>
          </section>

          <section className="notion-card p-6">
            <h2 className="text-base font-bold text-[#37352f]">2. Responsabilité de l’Utilisateur</h2>
            <p className="mt-2 text-xs text-[#787774]">
              L’utilisateur conserve l’entière responsabilité de l’usage fait des fichiers GPX générés et de leur exportation 
              vers des plateformes tierces (notamment Strava, Garmin Connect, Suunto ou Komoot). 
              L’utilisateur s’engage à respecter les chartes d’utilisation et les règles desdites plateformes.
            </p>
          </section>

          <section className="notion-card p-6">
            <h2 className="text-base font-bold text-[#37352f]">3. Disponibilité & Limitation de Garantie</h2>
            <p className="mt-2 text-xs text-[#787774]">
              Le service est fourni « en l’état ». Bien que No Run s’efforce de garantir une disponibilité maximale 
              et une précision optimale des algorithmes physiologiques (GAP Minetti bi-passe), aucune garantie de résultat 
              ou d’acceptation automatique par les serveurs tiers n’est formulée.
            </p>
          </section>

          <section className="notion-card p-6">
            <h2 className="text-base font-bold text-[#37352f]">4. Propriété Intellectuelle</h2>
            <p className="mt-2 text-xs text-[#787774]">
              Les éléments constitutifs de l’interface, les algorithmes de lissage télémétrique et les éléments graphiques 
              sont la propriété de No Run.
            </p>
          </section>

          <section className="notion-card p-6">
            <h2 className="text-base font-bold text-[#37352f]">5. Droit Applicable</h2>
            <p className="mt-2 text-xs text-[#787774]">
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
