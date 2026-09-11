import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function ConnexionPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbfbf9]">
      <SiteHeader />

      <main className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-16 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-[#fff2eb] text-[#fc5200] border border-[#ffd8c7] shadow-sm">
          <CheckCircle2 className="size-7" />
        </div>
        <div className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-full border border-[#ffd8c7] bg-[#fff2eb] px-3.5 py-1 text-xs font-semibold text-[#fc5200] mx-auto">
          <Sparkles className="size-3 text-[#fc5200]" />
          <span>Accès Immédiat</span>
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#1d1d1f]">Session Ouverte Immédiate</h1>
        <p className="mt-2.5 text-xs leading-relaxed text-[#666660]">
          Dans l’écosystème <strong>GhostPace Stealth Lab</strong>, tous les modules de vectorisation de tracé,
          d’altimétrie SRTM et d’exportation GPX sont disponibles instantanément, sans compte ni identifiants requis.
        </p>
        <div className="mt-7">
          <Button asChild size="lg" className="w-full text-xs font-bold uppercase tracking-wider">
            <Link href="/create">Lancer le GhostPace Lab</Link>
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
