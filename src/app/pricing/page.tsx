import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PricingView } from '@/components/PricingView';

export const metadata = {
  title: 'Tarifs & Packs — No Run',
  description: 'Crédits valables à vie sans abonnement, ou Club Alibi mensuel avec report des crédits.',
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f5]">
      <SiteHeader />
      <main className="flex-1">
        <PricingView />
      </main>
      <SiteFooter />
    </div>
  );
}
