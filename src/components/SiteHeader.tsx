'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/pricing', label: 'Tarifs' },
    { href: '/comment-importer', label: 'Importer sur Strava' },
  ];

  return (
    <header className="sticky top-0 z-40 transition-all duration-300">
      <div className="mx-auto max-w-6xl px-3 pt-3 sm:pt-4">
        <div className="glass-pill flex h-14 items-center justify-between gap-3 rounded-full pl-4 pr-3 shadow-[0_8px_25px_-5px_rgba(29,29,31,0.06)] backdrop-blur-xl">
          {/* GhostPace Logo */}
          <Link aria-label="Accueil GhostPace" href="/" className="group flex items-center gap-2.5">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#fc5200] via-[#eb4d00] to-[#1d1d1f] shadow-sm shadow-[#fc5200]/25"
            >
              {/* Stealth GPS pulse icon */}
              <svg viewBox="0 0 100 100" className="size-4.5" aria-hidden="true">
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
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold tracking-tight text-[#1d1d1f] uppercase font-mono sm:text-lg">
                Ghost<span className="text-[#fc5200]">Pace</span>
              </span>
              <span className="hidden text-[9px] font-bold uppercase tracking-wider text-[#fc5200] bg-[#fff2eb] px-2 py-0.5 rounded-full border border-[#ffd8c7] sm:inline-block">
                Stealth Lab
              </span>
            </div>
          </Link>

          {/* Nav links with hover interaction */}
          <nav className="hidden items-center gap-1.5 md:flex">
            <Link
              href="/pricing"
              className={cn(
                'relative rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-200',
                pathname === '/pricing'
                  ? 'text-[#fc5200]'
                  : 'text-[#666660] hover:text-[#1d1d1f] hover:bg-[#f3f3f0]'
              )}
            >
              Accès Illimité
              {pathname === '/pricing' && (
                <motion.div
                  layoutId="headerActiveIndicator"
                  className="absolute inset-0 rounded-full bg-[#fbeee7]/90 -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
            <Link
              href="/comment-importer"
              className={cn(
                'relative rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-200',
                pathname === '/comment-importer'
                  ? 'text-[#fc5200]'
                  : 'text-[#666660] hover:text-[#1d1d1f] hover:bg-[#f3f3f0]'
              )}
            >
              Déploiement Strava
              {pathname === '/comment-importer' && (
                <motion.div
                  layoutId="headerActiveIndicator"
                  className="absolute inset-0 rounded-full bg-[#fbeee7]/90 -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          </nav>

          {/* Action buttons */}
          <div className="hidden items-center gap-2.5 md:flex">
            <Link
              className="rounded-full border border-[#e6e6e1] bg-white/80 px-4 py-1.5 text-xs font-semibold text-[#1d1d1f] transition-all hover:bg-[#f3f3f0] hover:border-[#d6d6cf] active:scale-95"
              href="/connexion"
            >
              Compte
            </Link>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 bg-gradient-to-r from-[#fc5200] via-[#eb4d00] to-[#cc4200] text-white shadow-md shadow-[#fc5200]/25 hover:shadow-lg hover:shadow-[#fc5200]/35 h-9 px-5"
                href="/create"
              >
                <Sparkles className="size-3.5 opacity-90" />
                <span>Tracer une sortie</span>
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu trigger */}
          <button
            type="button"
            aria-label="Ouvrir le menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-9 items-center justify-center rounded-full text-[#1d1d1f] transition-colors hover:bg-[#f3f3f0] md:hidden"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile dropdown with spring animation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2.5 rounded-2xl border border-[#e6e6e1] bg-white/95 p-4 shadow-xl backdrop-blur-xl md:hidden"
            >
              <nav className="flex flex-col gap-2">
                <Link
                  href="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#1d1d1f] transition-colors hover:bg-[#f3f3f0]"
                >
                  Tarifs & Accès Libre
                </Link>
                <Link
                  href="/comment-importer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#1d1d1f] transition-colors hover:bg-[#f3f3f0]"
                >
                  Déploiement Strava
                </Link>
                <Link
                  href="/connexion"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#1d1d1f] transition-colors hover:bg-[#f3f3f0]"
                >
                  Compte Studio
                </Link>
                <Link
                  href="/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#fc5200] to-[#eb4d00] text-sm font-semibold text-white shadow-md shadow-[#fc5200]/25"
                >
                  <Sparkles className="size-4" />
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
