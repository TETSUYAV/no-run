'use client';

import { useState } from 'react';
import { X, Sparkles, Gift, ArrowRight, Loader2, Lock } from 'lucide-react';
import { Button } from './ui/Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Veuillez renseigner une adresse email valide.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erreur de connexion.');
      }

      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#faf9f5] p-6 sm:p-7 shadow-2xl border border-[#e9e8e4] text-[#37352f]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-full text-[#787774] hover:bg-[#eae8e1] hover:text-[#37352f] transition-colors"
          aria-label="Fermer"
        >
          <X className="size-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[#fff2eb] text-[#fc5200] border border-[#ffd8c7] shadow-sm">
            <Gift className="size-6" />
          </div>

          <div className="mt-4 notion-card inline-flex items-center gap-1.5 px-3 py-1 text-xs text-[#787774]">
            <Sparkles className="size-3.5 text-[#fc5200]" />
            <span>Offre de bienvenue No Run</span>
          </div>

          <h2 className="mt-3 text-xl font-bold tracking-tight text-[#37352f]">
            Votre 1er tracé Strava est 100% offert
          </h2>

          <p className="mt-2 text-xs text-[#787774] leading-relaxed max-w-xs">
            Indiquez votre email pour télécharger immédiatement votre fichier GPX avec fréquence cardiaque et relief. Sans carte bancaire.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 w-full space-y-3">
            <div>
              <input
                type="email"
                placeholder="votre.email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 px-4 text-sm rounded-xl border border-[#d3d1cb] bg-white text-[#37352f] placeholder-[#9b9a97] focus:outline-none focus:ring-2 focus:ring-[#fc5200] focus:border-transparent transition-all shadow-sm"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 text-left">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 bg-[#fc5200] hover:bg-[#e04800] text-white transition-all shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Activation en cours...</span>
                </>
              ) : (
                <>
                  <span>Récupérer mon tracé gratuit</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-4 text-[11px] text-[#9b9a97] flex items-center justify-center gap-1.5">
            <Lock className="size-3 text-[#9b9a97]" />
            <span>Aucun spam. Vos crédits sont conservés et utilisables à tout moment.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
