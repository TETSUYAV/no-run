import Link from 'next/link';
import { Shield, Sparkles } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#e6e6e1] bg-white/70 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand & status */}
          <div className="flex flex-col items-center md:items-start gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold uppercase font-mono tracking-tight text-[#1d1d1f]">
                Ghost<span className="text-[#fc5200]">Pace</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#fc5200] bg-[#fff2eb] px-2 py-0.5 rounded-full border border-[#ffd8c7]">
                v1.2 Public
              </span>
            </div>
            <p className="text-xs text-[#666660]">
              Moteur télémétrique et générateur GPX calibré pour Strava, Garmin et Komoot.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#666660]">
            <Link href="/create" className="hover:text-[#fc5200] transition-colors">
              Tracer une sortie
            </Link>
            <Link href="/pricing" className="hover:text-[#fc5200] transition-colors">
              Tarifs & Accès
            </Link>
            <Link href="/comment-importer" className="hover:text-[#fc5200] transition-colors">
              Guide Strava
            </Link>
            <Link href="/privacy" className="hover:text-[#fc5200] transition-colors">
              Confidentialité
            </Link>
            <Link href="/terms" className="hover:text-[#fc5200] transition-colors">
              Conditions
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-[#f0f0ec] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#999990]">
          <p>© {new Date().getFullYear()} GhostPace Stealth Lab. Tous droits réservés.</p>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#10b981]" />
            <span>Tous les systèmes opérationnels (SRTM & Copernicus GPS)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
