import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Politique de Confidentialité — No Run',
  description: 'Engagement de No Run sur la protection des données personnelles, l’absence de traçage biométrique et le traitement local des traces.',
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f5]">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-14">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#fff2eb] text-[#fc5200] border border-[#ffd8c7]">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#37352f] sm:text-3xl">Politique de Confidentialité</h1>
            <p className="text-xs text-[#787774]">Document Public • Dernière mise à jour : 11 Septembre 2026</p>
          </div>
        </div>

        <div className="mt-8 space-y-6 text-sm text-[#37352f] leading-relaxed">
          <section className="notion-card p-6">
            <h2 className="text-base font-bold text-[#37352f]">1. Philosophie & Traitement Local</h2>
            <p className="mt-2 text-xs text-[#787774]">
              No Run privilégie une approche <em>privacy-by-design</em>. La création des coordonnées GPS, 
              le calcul d’asservissement GAP et la génération des fichiers GPX sont exécutés directement dans votre navigateur 
              ou de manière éphémère sans persistance de vos itinéraires sur nos serveurs.
            </p>
          </section>

          <section className="notion-card p-6">
            <h2 className="text-base font-bold text-[#37352f]">2. Données Collectées</h2>
            <p className="mt-2 text-xs text-[#787774]">
              Nous ne collectons aucune donnée biométrique réelle. Les données de télémétrie saisies (fréquence cardiaque simulée, 
              cadence estimée, allures cibles) ne sont jamais associées à votre identité civile et ne font l’objet d’aucun profilage commercial.
            </p>
          </section>

          <section className="notion-card p-6">
            <h2 className="text-base font-bold text-[#37352f]">3. Stockage Local (LocalStorage)</h2>
            <p className="mt-2 text-xs text-[#787774]">
              L’application utilise le stockage local de votre navigateur (<code>localStorage</code>) uniquement pour conserver 
              votre brouillon de tracé en cours afin d’éviter toute perte de données en cas de rechargement inopiné. 
              Aucun traceur publicitaire tiers n’est déposé sur votre terminal.
            </p>
          </section>

          <section className="notion-card p-6">
            <h2 className="text-base font-bold text-[#37352f]">4. Vos Droits (RGPD)</h2>
            <p className="mt-2 text-xs text-[#787774]">
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d’un droit d’accès, de rectification 
              et de suppression de vos informations. Vous pouvez à tout moment purger votre historique local via les paramètres 
              de votre navigateur ou réinitialiser votre tracé en un clic.
            </p>
          </section>

          <section className="notion-card p-6">
            <h2 className="text-base font-bold text-[#37352f]">5. Contact</h2>
            <p className="mt-2 text-xs text-[#787774]">
              Pour toute question relative à cette politique ou à l’exercice de vos droits, contactez l’équipe 
              à l’adresse : <code>contact@norun.app</code>.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
