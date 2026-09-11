import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Politique de Confidentialité — GhostPace Stealth Lab',
  description: 'Engagement de GhostPace sur la protection des données personnelles, l’absence de traçage biométrique et le traitement local des traces.',
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbfbf9]">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-[#fff2eb] text-[#fc5200] border border-[#ffd8c7]">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#1d1d1f] sm:text-3xl">Politique de Confidentialité</h1>
            <p className="text-xs text-[#666660]">Dernière mise à jour : 11 Septembre 2026</p>
          </div>
        </div>

        <div className="mt-8 space-y-8 text-sm text-[#3d3d3f] leading-relaxed">
          <section className="rounded-2xl border border-[#e6e6e1] bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1d1d1f]">1. Philosophie & Traitement Local</h2>
            <p className="mt-2 text-xs text-[#666660]">
              GhostPace Stealth Lab privilégie une approche <em>privacy-by-design</em>. La vectorisation des coordonnées GPS, 
              le calcul d’asservissement GAP et la génération des fichiers GPX sont exécutés directement dans votre navigateur 
              ou de manière éphémère sans persistance de vos itinéraires sur nos serveurs.
            </p>
          </section>

          <section className="rounded-2xl border border-[#e6e6e1] bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1d1d1f]">2. Données Collectées</h2>
            <p className="mt-2 text-xs text-[#666660]">
              Nous ne collectons aucune donnée biométrique réelle. Les données de télémétrie saisies (fréquence cardiaque simulée, 
              cadence estimée, allures cibles) ne sont jamais associées à votre identité civile et ne font l’objet d’aucun profilage commercial.
            </p>
          </section>

          <section className="rounded-2xl border border-[#e6e6e1] bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1d1d1f]">3. Stockage Local (Cookies & LocalStorage)</h2>
            <p className="mt-2 text-xs text-[#666660]">
              L’application utilise le stockage local de votre navigateur (<code>localStorage</code>) uniquement pour conserver 
              votre brouillon de tracé en cours afin d’éviter toute perte de données en cas de rechargement inopiné. 
              Aucun traceur publicitaire tiers n’est déposé sur votre terminal.
            </p>
          </section>

          <section className="rounded-2xl border border-[#e6e6e1] bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1d1d1f]">4. Vos Droits (RGPD)</h2>
            <p className="mt-2 text-xs text-[#666660]">
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d’un droit d’accès, de rectification 
              et de suppression de vos informations. Vous pouvez à tout moment purger votre historique local via les paramètres 
              de votre navigateur ou réinitialiser votre tracé en un clic.
            </p>
          </section>

          <section className="rounded-2xl border border-[#e6e6e1] bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1d1d1f]">5. Contact</h2>
            <p className="mt-2 text-xs text-[#666660]">
              Pour toute question relative à cette politique ou à l’exercice de vos droits, contactez l’équipe d’administration 
              à l’adresse : <code>contact@ghostpace.app</code>.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
