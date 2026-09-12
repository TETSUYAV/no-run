import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { AccountView } from '@/components/AccountView';

export const metadata = {
  title: 'Mon Compte & Connexion — No Run',
  description: 'Gérez votre solde de crédits d’export GPX valables à vie sans abonnement.',
};

export default function ConnexionPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f5]">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center">
        <AccountView />
      </main>
      <SiteFooter />
    </div>
  );
}
