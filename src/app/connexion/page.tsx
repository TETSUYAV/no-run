import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Accès Instantané — No Run',
  description: 'Accès libre et sans authentification au studio No Run.',
};

export default function ConnexionPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f5]">
      <SiteHeader />

      <main className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-16 text-center">
        <div className="notion-card p-8">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[#fff2eb] text-[#fc5200] border border-[#ffd8c7]">
            <CheckCircle2 className="size-6" />
          </div>
          <div className="mt-4 notion-card inline-flex items-center gap-1.5 px-3 py-0.5 text-xs mx-auto text-[#787774]">
            <Sparkles className="size-3 text-[#fc5200]" />
            <span>Accès Public & Libre</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#37352f]">
            Session Ouverte Immédiate
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-[#787774]">
            Sur <strong>No Run</strong>, tous les modules de création de faux tracés,
            d’altimétrie SRTM et d’exportation GPX pour Strava sont disponibles instantanément, sans identifiants ni inscription.
          </p>
          <div className="mt-6">
            <Button asChild size="lg" className="w-full text-xs font-bold uppercase tracking-wider rounded-xl">
              <Link href="/create" className="flex items-center justify-center gap-2">
                <span>Entrer dans le Studio</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
