import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Button } from '@/components/ui/Button';
import { Compass, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Page Non Trouvée (404) — No Run',
  description: 'La coordonnée GPS demandée n’existe pas sur la carte No Run.',
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbfbf9]">
      <SiteHeader />

      <main className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-20 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-[#fff2eb] text-[#fc5200] border border-[#ffd8c7] shadow-sm">
          <Compass className="size-8 animate-pulse" />
        </div>

        <div className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-full border border-[#ffd8c7] bg-[#fff2eb] px-3.5 py-1 text-xs font-semibold text-[#fc5200] mx-auto">
          <Sparkles className="size-3 text-[#fc5200]" />
          <span>Signal GPS Perdu</span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#1d1d1f] sm:text-4xl">
          Erreur 404
        </h1>
        <p className="mt-2.5 text-xs leading-relaxed text-[#666660]">
          Cette trace ou cette page n’existe pas dans notre base cartographique. 
          Revenez sur le tracé principal pour générer votre fichier GPX.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="default" className="w-full sm:w-auto text-xs font-bold uppercase tracking-wider">
            <Link href="/create">Retour au générateur</Link>
          </Button>
          <Button variant="outline" asChild size="default" className="w-full sm:w-auto text-xs font-semibold uppercase tracking-wider">
            <Link href="/pricing">Voir les tarifs</Link>
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
