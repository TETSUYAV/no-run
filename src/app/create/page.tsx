'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { SiteHeader } from '@/components/SiteHeader';
import { SidebarControls } from '@/components/SidebarControls';
import { ActivityDraft, RouteResult, Sport, Waypoint } from '@/lib/types';
import {
  DEFAULT_DEVICE_ID,
  SPORT_DEFAULTS,
  defaultStartTime,
  getDevicesForSport,
} from '@/lib/constants';
import { fetchRoute } from '@/lib/routing';
import { generateGPX } from '@/lib/gpx';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthModal } from '@/components/AuthModal';
import { PaywallModal } from '@/components/PaywallModal';
import { Gift, CheckCircle2, Sparkles, X } from 'lucide-react';

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(
  () => import('@/components/MapView').then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex size-full items-center justify-center bg-[var(--muted)]/40">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
          <span className="text-sm font-medium text-[var(--muted-foreground)]">
            Chargement de la carte…
          </span>
        </div>
      </div>
    ),
  }
);

const DRAFT_STORAGE_KEY = 'norun.draft.v1';
const LEGACY_GHOSTPACE_KEY = 'ghostpace.draft.v1';
const LEGACY_CANAPRUN_KEY = 'canaprun.draft.v1';

function createDefaultDraft(sport: Sport = 'running'): ActivityDraft {
  const defaults = SPORT_DEFAULTS[sport];
  const devices = getDevicesForSport(sport);
  return {
    sport,
    waypoints: [],
    pace: defaults.pace,
    paceVariation: 0.08,
    heartRateEnabled: false,
    heartRate: 155,
    heartRateVariation: 0.05,
    startTime: '2026-09-12T09:00',
    activityName: defaults.activityName,
    snapToRoads: defaults.supportsSnapping,
    deviceId: devices.find((d) => d.id === DEFAULT_DEVICE_ID)?.id ?? devices[0]?.id ?? DEFAULT_DEVICE_ID,
  };
}

export default function CreatePage() {
  const [draft, setDraft] = React.useState<ActivityDraft>(() => createDefaultDraft('running'));
  const [hasRestoredDraft, setHasRestoredDraft] = React.useState(false);

  const [routeResult, setRouteResult] = React.useState<RouteResult | null>(null);
  const [routeLoading, setRouteLoading] = React.useState(false);
  const [routeError, setRouteError] = React.useState<string | null>(null);

  const [isExporting, setIsExporting] = React.useState(false);
  const [exportError, setExportError] = React.useState<string | null>(null);

  const [user, setUser] = React.useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [isPaywallModalOpen, setIsPaywallModalOpen] = React.useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = React.useState<string | null>(null);
  const [paymentBanner, setPaymentBanner] = React.useState<string | null>(null);

  const refreshUser = React.useCallback(async () => {
    try {
      const res = await fetch('/api/auth');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  React.useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const payment = params.get('payment');
      if (payment === 'success' || payment === 'mock_success') {
        setPaymentBanner('Paiement validé ! Vos crédits sont activés et prêts à l’emploi.');
        refreshUser();
      }
    }
  }, [refreshUser]);

  // Restore draft from localStorage on mount
  React.useEffect(() => {
    try {
      const stored =
        localStorage.getItem(DRAFT_STORAGE_KEY) ||
        localStorage.getItem(LEGACY_GHOSTPACE_KEY) ||
        localStorage.getItem(LEGACY_CANAPRUN_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.waypoints) && parsed.waypoints.length > 0) {
          setDraft((prev) => ({
            ...prev,
            ...parsed,
            startTime: parsed.startTime || prev.startTime,
          }));
          setHasRestoredDraft(true);
        }
      } else {
        setDraft((prev) => ({ ...prev, startTime: defaultStartTime() }));
      }
    } catch (e) {
      console.warn('Could not read draft from localStorage', e);
    }
  }, []);

  // Persist draft to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch (e) {
      console.warn('Could not save draft to localStorage', e);
    }
  }, [draft]);

  // Route calculation whenever waypoints or snapping or sport change
  React.useEffect(() => {
    if (draft.waypoints.length < 2) {
      setRouteResult(null);
      setRouteError(null);
      setRouteLoading(false);
      return;
    }

    const controller = new AbortController();
    setRouteLoading(true);
    setRouteError(null);

    const timer = setTimeout(async () => {
      try {
        // Try local or API route calculation
        const res = await fetchRoute(
          draft.waypoints,
          draft.sport,
          draft.snapToRoads,
          controller.signal
        );
        if (!controller.signal.aborted) {
          setRouteResult(res);
          setRouteLoading(false);
        }
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          console.warn('Routing error:', err);
          setRouteError('Impossible de calculer le tracé.');
          setRouteLoading(false);
        }
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [draft.waypoints, draft.sport, draft.snapToRoads]);

  // Handlers for modifying draft
  const handleDraftChange = (patch: Partial<ActivityDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const handleSportChange = (newSport: Sport) => {
    setDraft((prev) => {
      const defaults = SPORT_DEFAULTS[newSport];
      const devices = getDevicesForSport(newSport);
      const isCustomName = prev.activityName !== SPORT_DEFAULTS[prev.sport].activityName;
      const deviceId = devices.some((d) => d.id === prev.deviceId)
        ? prev.deviceId
        : devices[0]?.id ?? DEFAULT_DEVICE_ID;

      return {
        ...prev,
        sport: newSport,
        pace: defaults.pace,
        deviceId,
        snapToRoads: defaults.supportsSnapping && prev.snapToRoads,
        activityName: isCustomName ? prev.activityName : defaults.activityName,
      };
    });
  };

  const handleAddWaypoint = (pt: Waypoint) => {
    setDraft((prev) => {
      if (prev.waypoints.length >= 100) return prev;
      return { ...prev, waypoints: [...prev.waypoints, pt] };
    });
  };

  const handleMoveWaypoint = (idx: number, pt: Waypoint) => {
    setDraft((prev) => ({
      ...prev,
      waypoints: prev.waypoints.map((old, i) => (i === idx ? pt : old)),
    }));
  };

  const handleRemoveWaypoint = (idx: number) => {
    setDraft((prev) => ({
      ...prev,
      waypoints: prev.waypoints.filter((_, i) => i !== idx),
    }));
  };

  const handleDrawWaypoints = (pts: Waypoint[]) => {
    setDraft((prev) => ({
      ...prev,
      waypoints: pts.slice(0, 100),
      snapToRoads: !!SPORT_DEFAULTS[prev.sport].supportsSnapping || prev.snapToRoads,
    }));
  };

  const handleClear = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      localStorage.removeItem(LEGACY_GHOSTPACE_KEY);
      localStorage.removeItem(LEGACY_CANAPRUN_KEY);
    } catch {}
    setDraft((prev) => ({
      ...createDefaultDraft(prev.sport),
      startTime: prev.startTime,
    }));
    setRouteResult(null);
    setRouteError(null);
    setHasRestoredDraft(false);
  };

  // GPX Export Handler via API (contrôle des crédits & session)
  const handleExport = async (overrideUser?: any) => {
    if (draft.waypoints.length < 2) return;
    setIsExporting(true);
    setExportError(null);
    setExportSuccessMessage(null);

    const currentUser = overrideUser || user;

    if (!currentUser) {
      setIsAuthModalOpen(true);
      setIsExporting(false);
      return;
    }

    try {
      const coords = routeResult?.coordinates ?? draft.waypoints;
      const elevations = routeResult?.elevations;

      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sport: draft.sport,
          waypoints: draft.waypoints,
          coordinates: coords,
          elevations,
          pace: draft.pace,
          paceVariation: draft.paceVariation,
          heartRate: draft.heartRateEnabled
            ? { baseHr: draft.heartRate, variation: draft.heartRateVariation }
            : undefined,
          startTime: draft.startTime,
          activityName: draft.activityName,
          deviceId: draft.deviceId,
          snapToRoads: draft.snapToRoads,
        }),
      });

      if (res.status === 401) {
        setIsAuthModalOpen(true);
        setIsExporting(false);
        return;
      }

      if (res.status === 402) {
        setIsPaywallModalOpen(true);
        setIsExporting(false);
        return;
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'L’export a échoué.');
      }

      const blob = await res.blob();
      const safeFilename = (draft.activityName || 'activite')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${safeFilename || 'activite'}.gpx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const remainingCreditsStr = res.headers.get('X-NoRun-Credits-Remaining');
      const creditReason = res.headers.get('X-NoRun-Credit-Reason');
      if (remainingCreditsStr !== null) {
        setUser((prev: any) => ({
          ...prev,
          credits: parseInt(remainingCreditsStr, 10),
          freeTrialAvailable: creditReason === 'free_trial' ? false : prev?.freeTrialAvailable,
        }));
      }

      setExportSuccessMessage(
        creditReason === 'free_trial'
          ? 'Votre 1er tracé offert a été exporté ! Prêt pour Strava.'
          : 'Tracé GPX exporté avec succès !'
      );
      setTimeout(() => setExportSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('GPX export failed:', err);
      setExportError(err?.message ?? 'L’export a échoué.');
    } finally {
      setIsExporting(false);
    }
  };

  const distanceM = routeResult?.distanceM ?? 0;
  const elevationGainM = routeResult?.elevationGainM ?? 0;

  return (
    <div className="flex min-h-[100dvh] flex-col lg:h-[100dvh] lg:overflow-hidden">
      <SiteHeader />

      <h1 className="sr-only">Créer un tracé GPX</h1>

      {/* Notifications bar */}
      {(paymentBanner || exportSuccessMessage) && (
        <div className="z-30 px-4 pt-2">
          {paymentBanner && (
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-800 border border-emerald-200 shadow-sm animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>{paymentBanner}</span>
              </div>
              <button
                onClick={() => setPaymentBanner(null)}
                className="p-1 text-emerald-600 hover:text-emerald-900"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}
          {exportSuccessMessage && (
            <div className="mx-auto mt-1 flex max-w-2xl items-center justify-between gap-2 rounded-xl bg-[#fff3ec] px-4 py-2.5 text-xs font-medium text-[#fc5200] border border-[#ffd8c7] shadow-sm animate-in fade-in">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-[#fc5200] shrink-0" />
                <span>{exportSuccessMessage}</span>
              </div>
              <button
                onClick={() => setExportSuccessMessage(null)}
                className="p-1 text-[#fc5200] hover:text-[#e04800]"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col pt-2 lg:flex-row lg:pt-[11px]">
        {/* Map View */}
        <div className="relative h-[45vh] shrink-0 lg:h-full lg:flex-1">
          <ErrorBoundary fallbackTitle="Erreur d’affichage du Studio de Tracé">
            <MapView
              waypoints={draft.waypoints}
              routeGeometry={routeResult?.coordinates ?? null}
              onAddWaypoint={handleAddWaypoint}
              onMoveWaypoint={handleMoveWaypoint}
              onRemoveWaypoint={handleRemoveWaypoint}
              onDrawWaypoints={handleDrawWaypoints}
              onClear={handleClear}
            />
          </ErrorBoundary>
        </div>

        {/* Sidebar Controls */}
        <SidebarControls
          draft={draft}
          onChange={handleDraftChange}
          onSportChange={handleSportChange}
          distanceM={distanceM}
          elevationGainM={elevationGainM}
          routeLoading={routeLoading}
          routeError={routeError}
          hasRestoredDraft={hasRestoredDraft}
          onExport={handleExport}
          isExporting={isExporting}
          exportError={exportError}
        />
      </div>

      {/* Modales Auth & Paywall */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(newUser) => {
          setUser(newUser);
          setIsAuthModalOpen(false);
          handleExport(newUser);
        }}
      />

      <PaywallModal
        isOpen={isPaywallModalOpen}
        onClose={() => setIsPaywallModalOpen(false)}
        userEmail={user?.email}
      />
    </div>
  );
}
