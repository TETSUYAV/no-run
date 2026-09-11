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
} from 'lucide-react';

export const metadata = {
  title: 'Déploiement Strava — GhostPace Stealth Lab',
  description:
    'Protocole pas à pas pour injecter votre trace GPX GhostPace sur Strava, Garmin Connect ou Komoot.',
};

export default function CommentImporterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbfbf9]">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-14">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ffd8c7] bg-[#fff2eb] px-3.5 py-1 text-xs font-semibold text-[#fc5200] shadow-sm">
            <Sparkles className="size-3 text-[#fc5200]" />
            <span>Protocole de Synchronisation</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#1d1d1f] sm:text-4xl">
            Déploiement de votre Trace GPX sur Strava
          </h1>
          <p className="mt-3 text-sm text-[#666660] max-w-md mx-auto leading-relaxed">
            Injection immédiate sur les serveurs Strava, Garmin Connect ou Komoot en quelques secondes.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Ordinateur */}
          <div className="rounded-3xl border border-[#e6e6e1] bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-[#fff2eb] text-[#fc5200] border border-[#ffd8c7]">
                <Laptop className="size-5" />
              </div>
              <h2 className="text-base font-bold text-[#1d1d1f]">Station Desktop</h2>
            </div>
            <ol className="mt-5 space-y-3.5 text-xs text-[#666660] list-decimal pl-4 leading-relaxed">
              <li>
                Accédez directement au portail d'import :{' '}
                <a
                  href="https://www.strava.com/upload/select"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#fc5200] underline underline-offset-4 hover:text-[#e34900] inline-flex items-center gap-1"
                >
                  strava.com/upload/select <ExternalLink className="size-3" />
                </a>
              </li>
              <li>Chargez votre fichier <code>.gpx</code> exporté depuis GhostPace.</li>
              <li>Ajustez la visibilité souhaitée (Public ou Abonnés uniquement).</li>
              <li>Cliquez sur « Enregistrer et visualiser ». Vos segments et votre allure calibrée apparaissent instantanément.</li>
            </ol>
          </div>

          {/* Smartphone */}
          <div className="rounded-3xl border border-[#e6e6e1] bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-[#fff2eb] text-[#fc5200] border border-[#ffd8c7]">
                <Smartphone className="size-5" />
              </div>
              <h2 className="text-base font-bold text-[#1d1d1f]">Terminal Mobile</h2>
            </div>
            <ol className="mt-5 space-y-3.5 text-xs text-[#666660] list-decimal pl-4 leading-relaxed">
              <li>
                Ouvrez Safari ou Chrome et rejoignez{' '}
                <a
                  href="https://www.strava.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#fc5200] underline underline-offset-4 hover:text-[#e34900] inline-flex items-center gap-1"
                >
                  strava.com <ExternalLink className="size-3" />
                </a>
              </li>
              <li>Basculez en « Version pour ordinateur » dans le menu de votre navigateur.</li>
              <li>Appuyez sur le « + » supérieur droit puis « Télécharger une activité ».</li>
              <li>Sélectionnez la trace GPX dans votre dossier Téléchargements et validez.</li>
            </ol>
          </div>
        </div>

        {/* Conseils */}
        <div className="mt-12">
          <h2 className="text-lg font-bold text-[#1d1d1f]">Règles de conformité Strava</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#e6e6e1] bg-white p-5 shadow-sm">
              <div className="flex size-9 items-center justify-center rounded-xl bg-[#fff2eb] text-[#fc5200]">
                <Calendar className="size-4" />
              </div>
              <h3 className="mt-3 text-xs font-bold text-[#1d1d1f]">Horodatage réaliste</h3>
              <p className="mt-1 text-[11px] text-[#666660] leading-relaxed">
                Les serveurs Strava rejettent les sorties situées dans le futur ou ayant la même minute de départ qu’une autre trace.
              </p>
            </div>
            <div className="rounded-2xl border border-[#e6e6e1] bg-white p-5 shadow-sm">
              <div className="flex size-9 items-center justify-center rounded-xl bg-[#fff2eb] text-[#fc5200]">
                <Activity className="size-4" />
              </div>
              <h3 className="mt-3 text-xs font-bold text-[#1d1d1f]">Discipline conforme</h3>
              <p className="mt-1 text-[11px] text-[#666660] leading-relaxed">
                Les balises <code>&lt;type&gt;Run&lt;/type&gt;</code> ou <code>Ride</code> assignent d’office les bonnes métriques sur votre profil.
              </p>
            </div>
            <div className="rounded-2xl border border-[#e6e6e1] bg-white p-5 shadow-sm">
              <div className="flex size-9 items-center justify-center rounded-xl bg-[#fff2eb] text-[#fc5200]">
                <FileCheck className="size-4" />
              </div>
              <h3 className="mt-3 text-xs font-bold text-[#1d1d1f]">Extensions Garmin TPX</h3>
              <p className="mt-1 text-[11px] text-[#666660] leading-relaxed">
                Fréquence cardiaque et cadence de foulée sont injectées point par point dans l’extension TrackPoint Garmin officielle.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 text-center">
          <p className="text-base font-semibold text-[#1d1d1f]">Prêt à générer votre session ?</p>
          <Button asChild size="lg" className="text-xs font-bold uppercase tracking-wider">
            <Link href="/create">Ouvrir le GhostPace Lab</Link>
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
