'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Route, Timer, Mountain, Zap } from 'lucide-react';
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
      icon: Route,
      value: distanceM === 0 ? '0 m' : formatDistance(distanceM),
      accent: false,
    },
    {
      label: 'Chrono Cible',
      icon: Timer,
      value: distanceM === 0 ? '0:00' : formatDuration(durationSec),
      accent: false,
    },
    {
      label: 'D+ Réel (SRTM)',
      icon: Mountain,
      value: elevationGainM === 0 ? '0 m' : `+${elevationGainM} m`,
      accent: false,
    },
    {
      label: paceLabel,
      icon: Zap,
      value: formatPaceValue(sport, pace),
      accent: true,
    },
  ];

  return (
    <div className="notion-card overflow-hidden p-3 transition-all duration-200 hover:shadow-md">
      {/* Cockpit header */}
      <div className="mb-2.5 flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs">📊</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#787774]">
            Télémétrie de Course
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {loading ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#fc5200]">
              <span className="size-1.5 animate-ping rounded-full bg-[#fc5200]" />
              Calcul…
            </span>
          ) : (
            <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-[#787774] bg-[#f1f0ec]">
              GAP Minetti v2
            </span>
          )}
        </div>
      </div>

      {/* Database board 2x2 grid */}
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              className="group relative flex flex-col justify-between rounded-lg border border-[#f1f0ec] bg-[#fafaf8] p-3 transition-all duration-150 hover:border-[#e3e2de] hover:bg-white hover:shadow-sm"
            >
              <div className="flex items-center justify-between text-[#787774]">
                <div className="flex items-center gap-1.5">
                  <Icon className="size-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[10px] font-semibold uppercase tracking-wide">
                    {stat.label}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-baseline">
                <motion.span
                  key={stat.value}
                  initial={{ opacity: 0.7, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`text-lg font-bold telemetry-mono ${
                    stat.accent ? 'text-[#fc5200]' : 'text-[#37352f]'
                  }`}
                >
                  {stat.value}
                </motion.span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
