'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'ghostpace.consent.v1';

export function CookieBanner() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        // Small delay for smooth entry
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore if localStorage unavailable
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    } catch {}
    setVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'essential_only');
    } catch {}
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-4 right-4 z-50 max-w-sm rounded-2xl border border-[#e6e6e1] bg-white/95 p-4 shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#fff2eb] text-[#fc5200] border border-[#ffd8c7]">
              <ShieldCheck className="size-4" />
            </div>
            <div className="flex-1 text-xs">
              <p className="font-semibold text-[#1d1d1f]">Confidentialité & Stockage Local</p>
              <p className="mt-1 text-[11px] text-[#666660] leading-relaxed">
                No Run utilise uniquement le stockage local pour préserver vos brouillons de tracé GPX. Aucun cookie publicitaire tiers n’est utilisé.{' '}
                <Link href="/privacy" className="underline text-[#fc5200] hover:text-[#cc4200]">
                  En savoir plus
                </Link>.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAccept}
                  className="rounded-full bg-[#fc5200] px-3.5 py-1.5 text-[11px] font-bold text-white shadow-sm hover:bg-[#eb4d00] transition-colors"
                >
                  Accepter
                </button>
                <button
                  type="button"
                  onClick={handleDecline}
                  className="rounded-full border border-[#e6e6e1] bg-white px-3 py-1.5 text-[11px] font-medium text-[#666660] hover:bg-[#f3f3f0] transition-colors"
                >
                  Essentiel seul
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDecline}
              aria-label="Fermer"
              className="text-[#999990] hover:text-[#1d1d1f] transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
