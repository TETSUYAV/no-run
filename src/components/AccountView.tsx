'use client';

import * as React from 'react';
import Link from 'next/link';
import { User, Gift, Zap, Crown, LogOut, ArrowRight, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function AccountView() {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const fetchUser = React.useCallback(async () => {
    try {
      const res = await fetch('/api/auth');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Veuillez renseigner une adresse email valide.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erreur lors de la connexion.');
      }

      setUser(data.user);
      setMessage(data.isNew ? 'Compte créé ! Votre 1er tracé offert est prêt.' : 'Connexion réussie.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      setUser(null);
      setMessage('Déconnexion effectuée.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenPortal = async () => {
    try {
      const res = await fetch('/api/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-[#fc5200]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      {user ? (
        <div className="notion-card p-7 text-left">
          <div className="flex items-center justify-between pb-5 border-b border-[#e9e8e4]">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[#fff2eb] text-[#fc5200] border border-[#ffd8c7]">
                <User className="size-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#37352f]">{user.email}</h2>
                <span className="text-[11px] text-[#787774]">Compte No Run actif</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-[#787774] hover:text-[#37352f] rounded-lg hover:bg-[#f1f0ec] transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="size-4" />
            </button>
          </div>

          {/* Solde & Statut */}
          <div className="mt-6 space-y-3">
            <div className="p-4 rounded-xl bg-[#faf9f5] border border-[#e8e7e3]">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#787774]">
                Solde de crédits
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#37352f] telemetry-mono">
                  {user.credits}
                </span>
                <span className="text-xs text-[#787774]">tracé{user.credits > 1 ? 's' : ''} disponible{user.credits > 1 ? 's' : ''}</span>
              </div>
              <p className="mt-1 text-[11px] text-[#787774]">
                Vos crédits sont valables à vie et ne périment jamais.
              </p>
            </div>

            {user.freeTrialAvailable && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <Gift className="size-4 text-emerald-600 shrink-0" />
                <span>Votre 1er tracé gratuit est prêt à être utilisé !</span>
              </div>
            )}

            {user.subscription?.status === 'active' && (
              <div className="p-4 rounded-xl bg-[#fff3ec] border border-[#ffd8c7] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#fc5200]">
                  <Crown className="size-4 text-[#fc5200] shrink-0" />
                  <span>Abonnement Club Alibi Actif</span>
                </div>
                <button
                  onClick={handleOpenPortal}
                  className="text-xs text-[#37352f] underline hover:text-[#fc5200]"
                >
                  Gérer
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-2.5">
            <Button asChild size="lg" className="w-full text-xs font-bold uppercase tracking-wider rounded-xl bg-[#fc5200] hover:bg-[#e04800] text-white">
              <Link href="/create" className="flex items-center justify-center gap-2">
                <span>Créer un faux tracé</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full text-xs font-semibold rounded-xl">
              <Link href="/pricing" className="flex items-center justify-center gap-2">
                <Zap className="size-3.5 text-[#fc5200]" />
                <span>Recharger mes crédits</span>
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="notion-card p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#fff2eb] text-[#fc5200] border border-[#ffd8c7]">
            <Gift className="size-6" />
          </div>

          <div className="mt-4 notion-card inline-flex items-center gap-1.5 px-3 py-0.5 text-xs mx-auto text-[#787774]">
            <Sparkles className="size-3 text-[#fc5200]" />
            <span>Accès instantané No Run</span>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#37352f]">
            Connexion & Gestion
          </h1>

          <p className="mt-2 text-xs leading-relaxed text-[#787774]">
            Indiquez votre adresse email pour accéder à votre solde de crédits et débloquer votre premier tracé Strava offert.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-3">
            <input
              type="email"
              placeholder="votre.email@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 px-4 text-sm rounded-xl border border-[#d3d1cb] bg-white text-[#37352f] placeholder-[#9b9a97] focus:outline-none focus:ring-2 focus:ring-[#fc5200] focus:border-transparent transition-all shadow-sm"
            />

            {error && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 text-left">
                {error}
              </p>
            )}

            {message && (
              <p className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-left flex items-center gap-2">
                <CheckCircle2 className="size-3.5 shrink-0" />
                <span>{message}</span>
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-11 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 bg-[#fc5200] hover:bg-[#e04800] text-white transition-all shadow-md hover:shadow-lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Vérification...</span>
                </>
              ) : (
                <>
                  <span>Continuer</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-4 text-[11px] text-[#9b9a97]">
            🔒 Sans mot de passe complexe. Aucun débit sans votre accord explicite.
          </p>
        </div>
      )}
    </div>
  );
}
