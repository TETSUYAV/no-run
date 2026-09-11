'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Sport } from '@/lib/types';
import { formatDistance, formatDuration, formatPaceValue } from '@/lib/constants';

export interface ActivityStatsProps {
  sport: Sport;
  distanceM: number;
  elevationGainM: number;
  pace: number;
  loading?: boolean;
}

export function ActivityStats({
  sport,
  distanceM,
  elevationGainM,
  pace,
  loading = false,
}: ActivityStatsProps) {
  let durationSec = 0;
  if (distanceM > 0) {
    if (sport === 'running') {
      durationSec = (distanceM / 1000) * (pace * 60);
    } else if (sport === 'cycling') {
      durationSec = ((distanceM / 1000) / pace) * 3600;
    } else {
      durationSec = (distanceM / 100) * (pace * 60);
    }
  }

  const paceLabel = sport === 'cycling' ? 'Vitesse Cible' : 'Allure Cible';

  const stats = [
    {
      label: 'Distance',
      value: distanceM === 0 ? '0 m' : formatDistance(distanceM),
    },
    {
      label: 'Chrono Cible',
      value: distanceM === 0 ? '0:00' : formatDuration(durationSec),
    },
    {
      label: 'D+ Réel (SRTM)',
      value: elevationGainM === 0 ? '0 m' : `+${elevationGainM} m`,
    },
    {
      label: paceLabel,
      value: formatPaceValue(sport, pace),
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#e6e6e1] bg-white/95 p-1.5 shadow-[0_4px_20px_-4px_rgba(29,29,31,0.06)] backdrop-blur-md">
      <div className="grid grid-cols-2 gap-1.5">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.04 }}
            className="group relative flex flex-col justify-between rounded-xl bg-[#fafaf7] px-3.5 py-2.5 transition-all duration-200 hover:bg-[#fff7f2]"
          >
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#73736c]">
              {stat.label}
            </span>
            <div className="mt-0.5 flex items-baseline">
              <motion.span
                key={stat.value}
                initial={{ opacity: 0.6, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-base font-extrabold tracking-tight text-[#1d1d1f] font-mono tabular-nums sm:text-lg"
              >
                {stat.value}
              </motion.span>
            </div>
            {loading && (
              <span className="absolute right-2 top-2 size-1.5 animate-ping rounded-full bg-[#fc5200]" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
