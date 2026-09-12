'use client';

import * as React from 'react';
import {
  Footprints,
  Bike,
  Waves,
  AlertCircle,
  Download,
  Sparkles,
  Heart,
  Calendar,
  Magnet,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
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
      ? 'Vitesse cible (km/h)'
      : draft.sport === 'swimming'
      ? 'Allure cible (min/100m)'
      : 'Allure cible (min/km)';

  return (
    <aside className="flex flex-col border-t border-[#e9e8e4] bg-[#faf9f5] lg:min-h-0 lg:w-[410px] lg:flex-none lg:overflow-y-auto lg:border-l lg:border-t-0 shadow-[-4px_0_24px_rgba(15,15,15,0.02)]">
      <div className="space-y-5 p-5">
        {/* Restored notice */}
        <AnimatePresence>
          {hasRestoredDraft && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="notion-callout flex items-center gap-2 px-3.5 py-2"
            >
              <Sparkles className="size-3.5 text-[#fc5200] shrink-0" />
              <span className="text-xs font-medium text-[#37352f]">Brouillon restauré depuis votre stockage local.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2x2 Stats Card (Notion Database Board) */}
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

        {/* Notion Page Properties Container */}
        <div className="space-y-4">
          {/* Sport radio group (Notion segmented view) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#787774]">
              Discipline sportive
            </label>
            <div
              role="radiogroup"
              aria-label="Type d’activité"
              className="grid grid-cols-3 gap-1 rounded-xl border border-[#e9e8e4] bg-[#f1f0ec]/70 p-1 shadow-inner"
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
                    className={`relative z-10 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc5200] ${
                      isActive ? 'font-semibold text-[#37352f]' : 'text-[#787774] hover:text-[#37352f]'
                    }`}
                  >
                    <Icon className="size-3.5" />
                    <span>{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="sportTabIndicator"
                        className="absolute inset-0 rounded-lg bg-white shadow-[0_1px_3px_rgba(15,15,15,0.08)] border border-[#e9e8e4] -z-10"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pace / Speed Slider */}
          <div className="notion-card p-4 space-y-3">
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
              hint="Variance physiologique naturelle simulant les relances de course."
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
          </div>

          {/* Heart Rate collapsible box */}
          <div className="notion-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="size-3.5 text-[#fc5200]" />
                <label
                  htmlFor="hr-toggle"
                  className="text-xs font-semibold uppercase tracking-wider text-[#787774] cursor-pointer"
                >
                  Télémétrie cardiaque
                </label>
              </div>
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
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-3.5 pt-2 border-t border-[#f1f0ec] overflow-hidden"
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

          {/* Date and time (Notion Date property) */}
          <div className="notion-card p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-[#787774] mb-1">
              <Calendar className="size-3.5 text-[#fc5200]" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Horodatage du départ
              </span>
            </div>
            <DateTimePicker
              value={draft.startTime}
              onChange={(val) => onChange({ startTime: val })}
            />
            <div className="notion-callout p-2.5 mt-2 flex items-start gap-2">
              <ShieldCheck className="size-3.5 text-[#fc5200] shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-[#787774]">
                <strong className="text-[#37352f]">Règle anti-doublon Strava</strong> : Décalez l'heure de départ si vous injectez plusieurs traces consécutives.
              </p>
            </div>
          </div>

          {/* Device selector */}
          <div className="notion-card p-4 space-y-2">
            <Field
              label="Signature matérielle (GPX Device)"
              hint="Les montres injectent les extensions TrackPoint Garmin (cadence & FC), compatibles Strava."
            >
              <div className="relative">
                <select
                  value={draft.deviceId}
                  onChange={(e) => onChange({ deviceId: e.target.value })}
                  aria-label="Appareil d’enregistrement"
                  className="h-10 w-full appearance-none rounded-lg border border-[#e9e8e4] bg-[#fafaf8] px-3 text-xs font-medium text-[#37352f] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc5200] focus-visible:border-transparent cursor-pointer pr-8 transition-all hover:bg-white"
                >
                  {availableDevices.map((dev) => (
                    <option key={dev.id} value={dev.id}>
                      {dev.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <ChevronDown className="size-3.5 text-[#787774]" />
                </div>
              </div>
            </Field>
          </div>

          {/* Activity name */}
          <div className="notion-card p-4 space-y-2">
            <Field label="Nom de la session (Strava Title)">
              <input
                type="text"
                maxLength={100}
                value={draft.activityName}
                onChange={(e) => onChange({ activityName: e.target.value })}
                placeholder="Dawn Patrol — 10K Tempo"
                className="h-10 w-full rounded-lg border border-[#e9e8e4] bg-[#fafaf8] px-3 text-xs font-medium text-[#37352f] shadow-sm placeholder:text-[#9b9a97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc5200] focus-visible:border-transparent transition-all hover:bg-white"
              />
            </Field>
          </div>

          {/* Snap to roads toggle */}
          <div className="notion-card p-4 flex items-center justify-between">
            <div className="pr-4">
              <div className="flex items-center gap-1.5">
                <Magnet className="size-3.5 text-[#fc5200]" />
                <label
                  htmlFor="snap-toggle"
                  className="text-xs font-semibold uppercase tracking-wider text-[#787774] cursor-pointer"
                >
                  Asservissement aux sentiers
                </label>
              </div>
              <p className="text-[11px] text-[#787774] mt-0.5">
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
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="pt-2">
            <Button
              size="lg"
              className="w-full h-12 text-xs font-bold uppercase tracking-wider shadow-md shadow-[#fc5200]/25 bg-gradient-to-r from-[#fc5200] via-[#eb4d00] to-[#cc4200] text-white hover:shadow-lg hover:shadow-[#fc5200]/35 rounded-xl"
              disabled={draft.waypoints.length < 2 || isExporting}
              onClick={onExport}
            >
              <Download className="size-4 shrink-0" />
              <span>{isExporting ? 'Calcul télémétrique en cours…' : 'Télécharger le tracé GPX'}</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </aside>
  );
}
