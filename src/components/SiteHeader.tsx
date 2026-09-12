'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles, Activity, Gift, Zap, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    fetch('/api/auth')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, [pathname]);


  return (
    <header className="sticky top-0 z-40 transition-all duration-300">
      <div className="w-full px-3 sm:px-6 lg:px-8 pt-2.5 sm:pt-3.5">
        <div className="glass-pill flex h-14 sm:h-15 items-center justify-between gap-4 sm:gap-6 rounded-2xl px-4 sm:px-6 shadow-[0_2px_16px_rgba(55,53,47,0.05)] border border-[#e8e7e3] bg-[#ffffff]/92 backdrop-blur-xl">
          {/* No Run Workspace Logo */}
          <Link aria-label="Accueil No Run" href="/" className="group flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex size-8.5 sm:size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#fc5200] via-[#eb4d00] to-[#37352f] shadow-sm shadow-[#fc5200]/25"
            >
              {/* Stealth GPS pulse icon */}
              <svg viewBox="0 0 100 100" className="size-5" aria-hidden="true">
                <path
                  d="M18 78 L42 46 L60 62 L84 22"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="84" cy="22" r="6" fill="#ff7a38" />
                <circle cx="18" cy="78" r="5" fill="#ffffff" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-[#10b981] ring-2 ring-white animate-pulse" />
            </motion.div>
            
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-[#37352f] font-mono">
                No <span className="text-[#fc5200]">Run</span>
              </span>
            </div>
          </Link>

          {/* Notion Document Nav Links */}
          <nav className="hidden items-center gap-2 sm:gap-3 md:flex">
            <Link
              href="/create"
              className={cn(
                'relative rounded-xl px-4 py-2 text-xs sm:text-[13px] font-medium transition-colors duration-150',
                pathname === '/create'
                  ? 'text-[#fc5200] font-semibold'
                  : 'text-[#787774] hover:text-[#37352f] hover:bg-[#f1f0ec]'
              )}
            >
              Faire un tracé
              {pathname === '/create' && (
                <motion.div
                  layoutId="headerActiveIndicator"
                  className="absolute inset-0 rounded-xl bg-[#fff3ec] border border-[#ffd8c7]/60 -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
            <Link
              href="/pricing"
              className={cn(
                'relative rounded-xl px-4 py-2 text-xs sm:text-[13px] font-medium transition-colors duration-150',
                pathname === '/pricing'
                  ? 'text-[#fc5200] font-semibold'
                  : 'text-[#787774] hover:text-[#37352f] hover:bg-[#f1f0ec]'
              )}
            >
              Tarifs
              {pathname === '/pricing' && (
                <motion.div
                  layoutId="headerActiveIndicator"
                  className="absolute inset-0 rounded-xl bg-[#fff3ec] border border-[#ffd8c7]/60 -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
            <Link
              href="/comment-importer"
              className={cn(
                'relative rounded-xl px-4 py-2 text-xs sm:text-[13px] font-medium transition-colors duration-150',
                pathname === '/comment-importer'
                  ? 'text-[#fc5200] font-semibold'
                  : 'text-[#787774] hover:text-[#37352f] hover:bg-[#f1f0ec]'
              )}
            >
              Guide Strava
              {pathname === '/comment-importer' && (
                <motion.div
                  layoutId="headerActiveIndicator"
                  className="absolute inset-0 rounded-xl bg-[#fff3ec] border border-[#ffd8c7]/60 -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          </nav>

          {/* Right side telemetry & action buttons */}
          <div className="hidden items-center gap-2.5 sm:gap-3 md:flex">
            {/* Compteur de crédits */}
            {user ? (
              <Link
                href="/pricing"
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all',
                  user.credits > 0
                    ? 'bg-[#fff2eb] border-[#ffd8c7] text-[#fc5200] hover:bg-[#ffe5d6]'
                    : user.freeTrialAvailable
                    ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#059669] hover:bg-[#d1fae5]'
                    : 'bg-[#f7f6f3] border-[#e8e7e3] text-[#787774] hover:text-[#fc5200]'
                )}
                title="Solde de crédits — Cliquer pour recharger"
              >
                {user.credits > 0 ? (
                  <>
                    <Zap className="size-3 text-[#fc5200]" />
                    <span className="telemetry-mono font-bold text-[#fc5200]">{user.credits}</span>
                    <span className="text-[11px] font-medium text-[#787774]">
                      crédit{user.credits > 1 ? 's' : ''}
                    </span>
                  </>
                ) : user.freeTrialAvailable ? (
                  <>
                    <Gift className="size-3.5 text-[#059669]" />
                    <span>1 tracé offert</span>
                  </>
                ) : (
                  <>
                    <Zap className="size-3 text-[#787774]" />
                    <span className="telemetry-mono font-bold">0</span>
                    <span className="text-[11px] text-[#787774]">crédit</span>
                  </>
                )}
              </Link>
            ) : (
              <Link
                href="/pricing"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#fff2eb] border border-[#ffd8c7] text-xs font-medium text-[#fc5200] hover:bg-[#ffe5d6] transition-all"
                title="1er tracé GPX offert sans carte bancaire"
              >
                <Gift className="size-3.5 text-[#fc5200]" />
                <span className="font-semibold">1 offert</span>
              </Link>
            )}

            {/* Bouton de connexion */}
            <Link
              href="/connexion"
              className="flex items-center gap-1.5 rounded-xl border border-[#e8e7e3] bg-white px-3.5 py-1.5 text-xs sm:text-[13px] font-medium text-[#37352f] transition-all hover:bg-[#f7f6f3] hover:border-[#d6d5cf] active:scale-95"
            >
              <UserIcon className="size-3.5 text-[#787774]" />
              <span>{user ? 'Mon Compte' : 'Connexion'}</span>
            </Link>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs sm:text-[13px] font-semibold transition-all duration-200 bg-gradient-to-r from-[#fc5200] via-[#eb4d00] to-[#d64300] text-white shadow-sm shadow-[#fc5200]/30 hover:shadow-md hover:shadow-[#fc5200]/40 h-9 sm:h-9.5 px-4 sm:px-5"
                href="/create"
              >
                <Activity className="size-4" />
                <span>Tracer un run</span>
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu trigger */}
          <button
            type="button"
            aria-label="Ouvrir le menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-8 items-center justify-center rounded-lg text-[#37352f] transition-colors hover:bg-[#f1f0ec] md:hidden"
          >
            {mobileMenuOpen ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
          </button>
        </div>

        {/* Mobile dropdown with spring animation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 rounded-2xl border border-[#e8e7e3] bg-white/95 p-3.5 shadow-xl backdrop-blur-xl md:hidden"
            >
              <nav className="flex flex-col gap-1.5">
                <Link
                  href="/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-xs font-medium text-[#37352f] transition-colors hover:bg-[#f1f0ec]"
                >
                  Faire un tracé
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-xs font-medium text-[#37352f] transition-colors hover:bg-[#f1f0ec]"
                >
                  Tarifs
                </Link>
                <Link
                  href="/comment-importer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-xs font-medium text-[#37352f] transition-colors hover:bg-[#f1f0ec]"
                >
                  Guide Déploiement Strava
                </Link>

                <div className="my-1 border-t border-[#f1f0ec]" />

                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#faf9f5] border border-[#e8e7e3]">
                  <span className="text-xs text-[#787774]">Solde de crédits</span>
                  {user ? (
                    <Link
                      href="/pricing"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs font-bold text-[#fc5200] telemetry-mono"
                    >
                      {user.credits} crédit{user.credits > 1 ? 's' : ''}
                    </Link>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600">
                      1 offert
                    </span>
                  )}
                </div>

                <Link
                  href="/connexion"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-xs font-medium text-[#37352f] transition-colors hover:bg-[#f1f0ec] flex items-center justify-between"
                >
                  <span>{user ? 'Mon Compte' : 'Connexion'}</span>
                  <UserIcon className="size-3.5 text-[#787774]" />
                </Link>

                <Link
                  href="/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-1.5 flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#fc5200] to-[#eb4d00] text-xs font-semibold text-white shadow-sm shadow-[#fc5200]/25"
                >
                  <Sparkles className="size-3.5" />
                  <span>Tracer une sortie</span>
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
