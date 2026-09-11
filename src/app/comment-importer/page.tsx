import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Button } from '@/components/ui/Button';
import {
  Laptop,
  Smartphone,
  Calendar,
  Activity,
  FileCheck,
  ExternalLink,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const metadata = {
  title: 'Guide d’Import Strava — No Run',
  description:
    'Protocole pas à pas pour injecter votre faux tracé GPX No Run sur Strava, Garmin Connect ou Komoot.',
};

export default function CommentImporterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f5]">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-14">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="notion-card inline-flex items-center gap-1.5 px-3 py-1 text-xs text-[#787774]">
            <Sparkles className="size-3.5 text-[#fc5200]" />
            <span>Guide Officiel d'Injection</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#37352f] sm:text-4xl">
            Déploiement de votre Trace sur Strava
          </h1>
          <p className="mt-3 text-sm text-[#787774] leading-relaxed">
            Injection immédiate de votre fichier GPX No Run sur les serveurs Strava, Garmin Connect ou Komoot.
          </p>
        </div>

        {/* Guides by device */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Ordinateur */}
          <div className="notion-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#fff2eb] text-[#fc5200] border border-[#ffd8c7]">
                <Laptop className="size-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#37352f]">Station Desktop / Ordinateur</h2>
                <span className="text-[11px] text-[#787774]">Méthode la plus rapide (30 secondes)</span>
              </div>
            </div>
            <ol className="mt-5 space-y-3.5 text-xs text-[#37352f] list-decimal pl-4 leading-relaxed">
              <li>
                Accédez directement au portail officiel :{' '}
                <a
                  href="https://www.strava.com/upload/select"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#fc5200] underline underline-offset-4 hover:text-[#e34900] inline-flex items-center gap-1"
                >
                  strava.com/upload/select <ExternalLink className="size-3" />
                </a>
              </li>
              <li>Sélectionnez votre fichier <code>.gpx</code> téléchargé depuis No Run.</li>
              <li>Ajustez la visibilité souhaitée (Public ou Abonnés uniquement).</li>
              <li>Cliquez sur « Enregistrer et visualiser ». Vos segments et votre allure exacte apparaissent instantanément.</li>
            </ol>
          </div>

          {/* Smartphone */}
          <div className="notion-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#fff2eb] text-[#fc5200] border border-[#ffd8c7]">
                <Smartphone className="size-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#37352f]">Terminal Mobile (iOS & Android)</h2>
                <span className="text-[11px] text-[#787774]">Depuis Safari ou Chrome</span>
              </div>
            </div>
            <ol className="mt-5 space-y-3.5 text-xs text-[#37352f] list-decimal pl-4 leading-relaxed">
              <li>
                Ouvrez Safari ou Chrome et accédez à{' '}
                <a
                  href="https://www.strava.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#fc5200] underline underline-offset-4 hover:text-[#e34900] inline-flex items-center gap-1"
                >
                  strava.com <ExternalLink className="size-3" />
                </a>
              </li>
              <li>Activez la « Version pour ordinateur » dans le menu de votre navigateur mobile.</li>
              <li>Appuyez sur le bouton « + » en haut à droite puis « Télécharger une activité ».</li>
              <li>Sélectionnez la trace GPX dans votre dossier Téléchargements et validez.</li>
            </ol>
          </div>
        </div>

        {/* Conseils de calibration */}
        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#787774]">
            Règles d’acceptation algorithmique Strava
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="notion-card p-4">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#fff2eb] text-[#fc5200]">
                <Calendar className="size-4" />
              </div>
              <h3 className="mt-2.5 text-xs font-bold text-[#37352f]">Horodatage réaliste</h3>
              <p className="mt-1 text-[11px] text-[#787774] leading-relaxed">
                Strava rejette les sorties situées dans le futur ou ayant la même minute de départ qu’une autre trace.
              </p>
            </div>
            <div className="notion-card p-4">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#fff2eb] text-[#fc5200]">
                <Activity className="size-4" />
              </div>
              <h3 className="mt-2.5 text-xs font-bold text-[#37352f]">Discipline conforme</h3>
              <p className="mt-1 text-[11px] text-[#787774] leading-relaxed">
                Les balises GPX <code>&lt;type&gt;Run&lt;/type&gt;</code> ou <code>Ride</code> assignent d’office les bonnes métriques sur votre profil.
              </p>
            </div>
            <div className="notion-card p-4">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#fff2eb] text-[#fc5200]">
                <FileCheck className="size-4" />
              </div>
              <h3 className="mt-2.5 text-xs font-bold text-[#37352f]">Extensions Garmin TPX</h3>
              <p className="mt-1 text-[11px] text-[#787774] leading-relaxed">
                Fréquence cardiaque et cadence de foulée sont injectées point par point dans le namespace officiel Garmin.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <p className="text-sm font-semibold text-[#37352f]">Prêt à générer votre session ?</p>
          <Button asChild size="lg" className="text-xs font-bold uppercase tracking-wider rounded-xl">
            <Link href="/create" className="flex items-center gap-2">
              <span>Lancer le Studio No Run</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
