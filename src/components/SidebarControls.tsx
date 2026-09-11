'use client';

import * as React from 'react';
import { Footprints, Bike, Waves, AlertCircle, Download, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActivityDraft, Sport } from '@/lib/types';
import {
  SPORT_DEFAULTS,
  getDevicesForSport,
  regularityLabel,
  formatPaceValue,
} from '@/lib/constants';
import { ActivityStats } from './ActivityStats';
import { Field } from './ui/Field';
import { Slider } from './ui/Slider';
import { Switch } from './ui/Switch';
import { Button } from './ui/Button';
import { DateTimePicker } from './DateTimePicker';

export interface SidebarControlsProps {
  draft: ActivityDraft;
  onChange: (patch: Partial<ActivityDraft>) => void;
  onSportChange: (sport: Sport) => void;
  distanceM: number;
  elevationGainM: number;
  routeLoading: boolean;
  routeError: string | null;
  hasRestoredDraft?: boolean;
  onExport: () => void;
  isExporting: boolean;
  exportError: string | null;
}

export function SidebarControls({
  draft,
  onChange,
  onSportChange,
  distanceM,
  elevationGainM,
  routeLoading,
  routeError,
  hasRestoredDraft,
  onExport,
  isExporting,
  exportError,
}: SidebarControlsProps) {
  const sportConfig = SPORT_DEFAULTS[draft.sport];
  const availableDevices = getDevicesForSport(draft.sport);

  const sportTabs = [
    { value: 'running' as Sport, label: 'Course', icon: Footprints },
    { value: 'cycling' as Sport, label: 'Vélo', icon: Bike },
    { value: 'swimming' as Sport, label: 'Natation', icon: Waves },
  ];

  const paceFieldLabel =
    draft.sport === 'cycling'
      ? 'Vitesse (km/h)'
      : draft.sport === 'swimming'
      ? 'Allure (min/100m)'
      : 'Allure (min/km)';

  return (
    <aside className="flex flex-col border-t border-[#e6e6e1] bg-[#fbfbf9]/95 backdrop-blur-xl lg:min-h-0 lg:w-[410px] lg:flex-none lg:overflow-y-auto lg:border-l lg:border-t-0 shadow-[-4px_0_24px_rgba(29,29,31,0.03)]">
      <div className="space-y-6 p-5">
        {/* Restored notice */}
        <AnimatePresence>
          {hasRestoredDraft && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2 rounded-xl bg-[#fff2eb] border border-[#ffd8c7] px-3.5 py-2 text-xs font-medium text-[#c43e00]"
            >
              <Sparkles className="size-3.5 text-[#fc5200] shrink-0" />
              <span>Votre tracé précédent a été retrouvé.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2x2 Stats Card */}
        <ActivityStats
          sport={draft.sport}
          distanceM={distanceM}
          elevationGainM={elevationGainM}
          pace={draft.pace}
          loading={routeLoading}
        />

        {/* Error alerts */}
        <AnimatePresence>
          {routeError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              role="alert"
              className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700"
            >
              <AlertCircle className="size-4 shrink-0 text-rose-600" />
              <span>{routeError}</span>
            </motion.p>
          )}

          {exportError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              role="alert"
              className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700"
            >
              <AlertCircle className="size-4 shrink-0 text-rose-600" />
              <span>{exportError}</span>
            </motion.p>
          )}
        </AnimatePresence>

        <div className="space-y-5">
          {/* Sport radio group with spring pill indicator */}
          <div
            role="radiogroup"
            aria-label="Type d’activité"
            className="grid grid-cols-3 gap-1 rounded-2xl border border-[#e6e6e1] bg-[#f4f4f1]/90 p-1.5 shadow-inner"
          >
            {sportTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = draft.sport === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => onSportChange(tab.value)}
                  className={`relative z-10 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc5200] ${
                    isActive ? 'text-[#1d1d1f]' : 'text-[#666660] hover:text-[#1d1d1f]'
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="sportTabIndicator"
                      className="absolute inset-0 rounded-xl bg-white shadow-sm -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Pace / Speed Slider */}
          <Field
            label={paceFieldLabel}
            value={formatPaceValue(draft.sport, draft.pace)}
          >
            <Slider
              min={sportConfig.min}
              max={sportConfig.max}
              step={sportConfig.step}
              value={[draft.pace]}
              onValueChange={([val]) => onChange({ pace: val })}
              aria-label="Allure moyenne"
            />
          </Field>

          {/* Regularity Slider */}
          <Field
            label="Régularité biomécanique"
            value={regularityLabel(draft.paceVariation)}
            hint="Contrôle la variance naturelle de l’allure et les micro-relances."
          >
            <Slider
              min={0}
              max={0.5}
              step={0.01}
              value={[draft.paceVariation]}
              onValueChange={([val]) => onChange({ paceVariation: val })}
              aria-label="Régularité de l’allure"
            />
          </Field>

          {/* Heart Rate collapsible box */}
          <div className="space-y-3 rounded-2xl border border-[#e6e6e1] bg-white/70 p-4 shadow-sm backdrop-blur-sm transition-all">
            <div className="flex items-center justify-between">
              <label htmlFor="hr-toggle" className="text-xs font-semibold uppercase tracking-wider text-[#666660] cursor-pointer">
                Télémétrie cardiaque
              </label>
              <Switch
                id="hr-toggle"
                checked={draft.heartRateEnabled}
                onCheckedChange={(checked) => onChange({ heartRateEnabled: checked })}
              />
            </div>

            <AnimatePresence>
              {draft.heartRateEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4 pt-2 overflow-hidden"
                >
                  <Field label="Rythme moyen" value={`${draft.heartRate} bpm`}>
                    <Slider
                      min={20}
                      max={240}
                      step={1}
                      value={[draft.heartRate]}
                      onValueChange={([val]) => onChange({ heartRate: Math.round(val) })}
                      aria-label="Fréquence cardiaque moyenne"
                    />
                  </Field>
                  <Field
                    label="Variabilité"
                    value={`${Math.round(draft.heartRateVariation * 100)} %`}
                  >
                    <Slider
                      min={0}
                      max={0.4}
                      step={0.01}
                      value={[draft.heartRateVariation]}
                      onValueChange={([val]) => onChange({ heartRateVariation: val })}
                      aria-label="Variation de la fréquence cardiaque"
                    />
                  </Field>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Date and time */}
          <DateTimePicker
            value={draft.startTime}
            onChange={(val) => onChange({ startTime: val })}
          />

          <p className="rounded-xl border border-[#e6e6e1]/60 bg-[#f4f4f1]/60 px-3.5 py-2.5 text-[11px] leading-relaxed text-[#666660]">
            Protocole anti-doublon : Strava rejette deux activités commençant à la même minute. Décalez l’horodatage de départ entre chaque export.
          </p>

          {/* Device selector */}
          <Field
            label="Capteur GPS simulé"
            hint="Signature matérielle inscrite dans le GPX. Les montres transmettent la cadence à Strava, pas les smartphones."
          >
            <div className="relative">
              <select
                value={draft.deviceId}
                onChange={(e) => onChange({ deviceId: e.target.value })}
                aria-label="Appareil d’enregistrement"
                className="h-10 w-full appearance-none rounded-xl border border-[#e6e6e1] bg-white px-3 text-xs font-medium text-[#1d1d1f] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc5200] focus-visible:border-transparent cursor-pointer pr-8 transition-all"
              >
                {availableDevices.map((dev) => (
                  <option key={dev.id} value={dev.id}>
                    {dev.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#666660]">
                ▼
              </div>
            </div>
          </Field>

          {/* Activity name */}
          <Field label="Nom de la session">
            <input
              type="text"
              maxLength={100}
              value={draft.activityName}
              onChange={(e) => onChange({ activityName: e.target.value })}
              placeholder="Dawn Patrol — 10K Tempo"
              className="h-10 w-full rounded-xl border border-[#e6e6e1] bg-white px-3 text-xs font-medium text-[#1d1d1f] shadow-sm placeholder:text-[#8c8c85] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc5200] focus-visible:border-transparent transition-all"
            />
          </Field>

          {/* Snap to roads */}
          <div className="flex items-center justify-between rounded-2xl border border-[#e6e6e1] bg-white/70 p-3.5 shadow-sm">
            <div>
              <label htmlFor="snap-toggle" className="text-xs font-semibold uppercase tracking-wider text-[#666660] cursor-pointer">
                Asservissement aux sentiers
              </label>
              <p className="text-[11px] text-[#666660] mt-0.5">
                Verrouille le tracé sur le réseau routier et les sentiers réels.
              </p>
            </div>
            <Switch
              id="snap-toggle"
              checked={draft.snapToRoads}
              onCheckedChange={(checked) => onChange({ snapToRoads: checked })}
            />
          </div>

          {/* Export button with Strava Orange Shimmer & spring */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              className="w-full h-12 text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#fc5200]/25 bg-gradient-to-r from-[#fc5200] via-[#eb4d00] to-[#cc4200] text-white hover:shadow-xl hover:shadow-[#fc5200]/35"
              disabled={draft.waypoints.length < 2 || isExporting}
              onClick={onExport}
            >
              <Download className="size-4 shrink-0" />
              <span>{isExporting ? 'Calcul télémétrique en cours…' : 'Générer la trace fantôme GPX'}</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </aside>
  );
}
