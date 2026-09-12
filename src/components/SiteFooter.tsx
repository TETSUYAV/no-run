import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#e9e8e4] bg-[#faf9f5]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand & status */}
          <div className="flex flex-col items-center md:items-start gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold font-mono tracking-tight text-[#37352f]">
                No <span className="text-[#fc5200]">Run</span>
              </span>
              <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-[#787774] bg-[#f1f0ec]">
                v1.2 Studio GPS
              </span>
            </div>
            <p className="text-xs text-[#787774]">
              Générateur de traces Strava et simulateur télémétrique sans bouger du canapé.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#787774]">
            <Link href="/create" className="hover:text-[#fc5200] transition-colors">
              Tracer une sortie
            </Link>
            <Link href="/pricing" className="hover:text-[#fc5200] transition-colors">
              Tarifs
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

        <div className="mt-8 border-t border-[#f1f0ec] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#9b9a97]">
          <p>© {new Date().getFullYear()} No Run. Document public non affilié à Strava Inc.</p>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#10b981]" />
            <span className="text-[#374635] font-medium">Tous les systèmes opérationnels (SRTM & Copernicus GPS)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
