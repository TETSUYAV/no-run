'use client';

import * as React from 'react';
import { Search, Loader2, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaceSearchResult } from '@/lib/types';

export interface PlaceSearchProps {
  onSelect: (result: PlaceSearchResult) => void;
}

export function PlaceSearch({ onSelect }: PlaceSearchProps) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<PlaceSearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  React.useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
          query.trim()
        )}&lang=fr&limit=5`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();

        const formatted: PlaceSearchResult[] = (data.features || []).map(
          (feat: any, idx: number) => {
            const props = feat.properties || {};
            const parts = [
              props.name,
              props.city || props.town || props.village,
              props.postcode,
              props.country,
            ].filter(Boolean);
            const nom = parts.join(', ');
            return {
              id: `${props.osm_id || idx}-${nom}`,
              nom: nom || props.name || 'Lieu sans nom',
              center: [feat.geometry.coordinates[0], feat.geometry.coordinates[1]],
              bbox: feat.bbox,
            };
          }
        );

        setResults(formatted);
        setIsOpen(true);
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          console.warn('Geocoding error:', err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 280);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  const handleSelect = (item: PlaceSearchResult) => {
    onSelect(item);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-72 max-w-[calc(100vw-2rem)]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (results[0]) handleSelect(results[0]);
        }}
        className="relative"
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#787774]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Rechercher un spot, col, ville…"
          aria-label="Rechercher un lieu"
          className="h-9 w-full rounded-lg border border-[#e9e8e4] bg-white/95 pl-8 pr-8 text-xs font-medium text-[#37352f] shadow-sm backdrop-blur-md placeholder:text-[#9b9a97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc5200] focus-visible:border-transparent transition-all"
        />
        {loading ? (
          <Loader2 className="absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 animate-spin text-[#fc5200]" />
        ) : query ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Effacer la recherche"
            className="absolute right-2 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-md text-[#787774] hover:bg-[#f1f0ec] transition-colors"
          >
            <X className="size-3" />
          </button>
        ) : null}
      </form>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="notion-card absolute left-0 right-0 top-full z-50 mt-1.5 max-h-60 overflow-y-auto p-1 backdrop-blur-md"
          >
            {results.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="group flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-[#f1f0ec]"
                >
                  <MapPin className="size-3.5 shrink-0 text-[#fc5200] opacity-80 group-hover:opacity-100" />
                  <span className="line-clamp-1 text-[#37352f] font-medium">{item.nom}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
