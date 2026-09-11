'use client';

import * as React from 'react';
import { Pencil, RotateCcw, Check, Trash2, X, Sparkles, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaceSearchResult, Waypoint } from '@/lib/types';
import { PlaceSearch } from './PlaceSearch';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';
import 'leaflet/dist/leaflet.css';

export interface BasemapConfig {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  url: string;
  options: {
    attribution: string;
    maxZoom: number;
    subdomains?: string;
  };
}

export const BASEMAPS: BasemapConfig[] = [
  {
    id: 'osm',
    label: 'Standard OSM',
    shortLabel: 'OSM',
    description: 'Réseau routier, sentiers & escaliers précis',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      maxZoom: 19,
    },
  },
  {
    id: 'topo',
    label: 'Relief & Outdoor',
    shortLabel: 'Relief',
    description: 'Courbes de niveau & topographie (Esri)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    options: {
      attribution: 'Tiles &copy; Esri & contributors',
      maxZoom: 19,
    },
  },
  {
    id: 'street',
    label: 'Urbain Clair',
    shortLabel: 'Urbain',
    description: 'Cartographie citadine épurée (Esri)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    options: {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19,
    },
  },
];

export interface MapViewProps {
  waypoints: Waypoint[];
  routeGeometry: Waypoint[] | null;
  onAddWaypoint: (pt: Waypoint) => void;
  onMoveWaypoint: (idx: number, pt: Waypoint) => void;
  onRemoveWaypoint: (idx: number) => void;
  onDrawWaypoints: (pts: Waypoint[]) => void;
  onClear: () => void;
}

// Ramer-Douglas-Peucker simplification
function simplifyPoints(points: Waypoint[], tolerance: number): Waypoint[] {
  if (points.length <= 2) return points;

  let maxDist = 0;
  let maxIdx = 0;

  const [p1x, p1y] = points[0];
  const [p2x, p2y] = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    const numerator = Math.abs(
      (p2y - p1y) * px - (p2x - p1x) * py + p2x * p1y - p2y * p1x
    );
    const denominator = Math.hypot(p2y - p1y, p2x - p1x);
    const dist = denominator === 0 ? Math.hypot(px - p1x, py - p1y) : numerator / denominator;

    if (dist > maxDist) {
      maxDist = dist;
      maxIdx = i;
    }
  }

  if (maxDist > tolerance) {
    const left = simplifyPoints(points.slice(0, maxIdx + 1), tolerance);
    const right = simplifyPoints(points.slice(maxIdx), tolerance);
    return [...left.slice(0, -1), ...right];
  }

  return [points[0], points[points.length - 1]];
}

export function MapView({
  waypoints,
  routeGeometry,
  onAddWaypoint,
  onMoveWaypoint,
  onRemoveWaypoint,
  onDrawWaypoints,
  onClear,
}: MapViewProps) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<any>(null);
  const leafletRef = React.useRef<any>(null);
  const markersRef = React.useRef<any[]>([]);
  const polylineRef = React.useRef<any>(null);
  const polylineHaloRef = React.useRef<any>(null);
  const drawingLayerRef = React.useRef<any>(null);

  const [mapReady, setMapReady] = React.useState(false);
  const [isDrawingMode, setIsDrawingMode] = React.useState(false);
  const [drawnPoints, setDrawnPoints] = React.useState<Waypoint[] | null>(null);
  const [showTip, setShowTip] = React.useState(true);
  const [selectedBasemap, setSelectedBasemap] = React.useState<string>('osm');
  const [isLayersOpen, setIsLayersOpen] = React.useState(false);
  const activeTileLayerRef = React.useRef<any>(null);
  const layersMenuRef = React.useRef<HTMLDivElement>(null);

  const waypointsRef = React.useRef(waypoints);
  waypointsRef.current = waypoints;

  const isDrawingModeRef = React.useRef(isDrawingMode);
  isDrawingModeRef.current = isDrawingMode;

  // Close layers dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (layersMenuRef.current && !layersMenuRef.current.contains(e.target as Node)) {
        setIsLayersOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize Leaflet Map
  React.useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = (await import('leaflet')).default;
      if (!isMounted) return;

      leafletRef.current = L;
      (window as any).L = L;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const initialCenter: [number, number] =
        waypoints.length > 0 ? [waypoints[0][1], waypoints[0][0]] : [48.8566, 2.3522];

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: waypoints.length > 0 ? 14 : 13,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Restore saved basemap preference
      let initialBasemapId = 'osm';
      try {
        const saved = localStorage.getItem('ghostpace.basemap.v1');
        if (saved && BASEMAPS.some((b) => b.id === saved)) {
          initialBasemapId = saved;
        }
      } catch {}
      setSelectedBasemap(initialBasemapId);

      const basemapConfig = BASEMAPS.find((b) => b.id === initialBasemapId) || BASEMAPS[0];
      const initialTileLayer = L.tileLayer(basemapConfig.url, basemapConfig.options).addTo(map);
      activeTileLayerRef.current = initialTileLayer;

      // Polyline halo (Strava peach glow)
      polylineHaloRef.current = L.polyline([], {
        color: '#fed8c4',
        weight: 8,
        opacity: 0.7,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Route polyline (Strava Signature Orange)
      polylineRef.current = L.polyline([], {
        color: '#fc5200',
        weight: 4.5,
        opacity: 0.98,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Freehand drawing polyline
      drawingLayerRef.current = L.polyline([], {
        color: '#fc5200',
        weight: 4,
        dashArray: '5, 8',
        opacity: 0.85,
      }).addTo(map);

      // Map click handler for adding waypoints
      map.on('click', (e: any) => {
        if (isDrawingModeRef.current) return;
        if (waypointsRef.current.length >= 100) return;
        onAddWaypoint([e.latlng.lng, e.latlng.lat]);
      });

      mapInstanceRef.current = map;
      setMapReady(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Basemap Layer dynamically
  React.useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;
    const map = mapInstanceRef.current;
    const L = leafletRef.current || (window as any).L;
    if (!L) return;

    const basemapConfig = BASEMAPS.find((b) => b.id === selectedBasemap) || BASEMAPS[0];

    if (activeTileLayerRef.current) {
      map.removeLayer(activeTileLayerRef.current);
    }

    const newTileLayer = L.tileLayer(basemapConfig.url, basemapConfig.options).addTo(map);
    newTileLayer.bringToBack();
    activeTileLayerRef.current = newTileLayer;

    try {
      localStorage.setItem('ghostpace.basemap.v1', selectedBasemap);
    } catch {}
  }, [selectedBasemap, mapReady]);

  // Update Route Polyline
  React.useEffect(() => {
    if (!mapInstanceRef.current || !polylineRef.current || !mapReady) return;

    const coordsToUse = routeGeometry && routeGeometry.length > 0 ? routeGeometry : waypoints;
    const latLngs = coordsToUse.map(([lng, lat]) => [lat, lng]);

    polylineRef.current.setLatLngs(latLngs);
    if (polylineHaloRef.current) {
      polylineHaloRef.current.setLatLngs(latLngs);
    }
  }, [routeGeometry, waypoints, mapReady]);

  // Update Waypoint Markers with Strava Orange design
  React.useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;

    const map = mapInstanceRef.current;
    const L = leafletRef.current || (window as any).L;
    if (!L) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    waypoints.forEach(([lng, lat], idx) => {
      const isStart = idx === 0;
      const isEnd = idx === waypoints.length - 1 && waypoints.length > 1;

      let iconHtml = '';
      if (isStart) {
        iconHtml = `<div class="marker-start-pulse" style="background: linear-gradient(135deg, #ff7024, #fc5200); width:24px; height:24px; border-radius:50%; border:2.5px solid white; box-shadow:0 3px 10px rgba(252,82,0,0.45); display:flex; align-items:center; justify-content:center; color:white; font-size:11px; font-weight:800; cursor:grab;">1</div>`;
      } else if (isEnd) {
        iconHtml = `<div style="background: linear-gradient(135deg, #e34900, #b83a00); width:24px; height:24px; border-radius:50%; border:2.5px solid white; box-shadow:0 3px 10px rgba(227,73,0,0.35); display:flex; align-items:center; justify-content:center; color:white; font-size:11px; font-weight:800; cursor:grab;">${waypoints.length}</div>`;
      } else {
        iconHtml = `<div style="background-color:white; width:16px; height:16px; border-radius:50%; border:3px solid #fc5200; box-shadow:0 2px 8px rgba(0,0,0,0.18); cursor:grab;"></div>`;
      }

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: iconHtml,
        iconSize: isStart || isEnd ? [24, 24] : [16, 16],
        iconAnchor: isStart || isEnd ? [12, 12] : [8, 8],
      });

      const marker = L.marker([lat, lng], {
        icon: customIcon,
        draggable: true,
      }).addTo(map);

      marker.bindTooltip(
        `Point ${idx + 1} (glisser pour ajuster, clic pour supprimer)`,
        { direction: 'top', offset: [0, -10], opacity: 0.95 }
      );

      marker.on('dragend', (e: any) => {
        const newLatLng = e.target.getLatLng();
        onMoveWaypoint(idx, [newLatLng.lng, newLatLng.lat]);
      });

      marker.on('click', (e: any) => {
        L.DomEvent.stopPropagation(e);
        onRemoveWaypoint(idx);
      });
      marker.on('contextmenu', (e: any) => {
        L.DomEvent.stopPropagation(e);
        onRemoveWaypoint(idx);
      });

      markersRef.current.push(marker);
    });
  }, [waypoints, mapReady, onMoveWaypoint, onRemoveWaypoint]);

  // Freehand Drawing Mode
  React.useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!isDrawingMode) {
      if (map.dragging && typeof map.dragging.enable === 'function') {
        try {
          map.dragging.enable();
        } catch {}
      }
      if (drawingLayerRef.current) {
        try {
          drawingLayerRef.current.setLatLngs([]);
        } catch {}
      }
      return;
    }

    if (map.dragging && typeof map.dragging.disable === 'function') {
      try {
        map.dragging.disable();
      } catch {}
    }

    const container = mapContainerRef.current;
    if (!container) return;

    let points: Waypoint[] = [];
    let isPointerDown = false;

    const getCoord = (clientX: number, clientY: number) => {
      try {
        const rect = container.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const latlng = map.containerPointToLatLng([x, y]);
        return [latlng.lng, latlng.lat] as Waypoint;
      } catch {
        return null;
      }
    };

    const handleStart = (clientX: number, clientY: number) => {
      isPointerDown = true;
      const pt = getCoord(clientX, clientY);
      if (!pt) return;
      points = [pt];
      if (drawingLayerRef.current) {
        try {
          drawingLayerRef.current.setLatLngs([[pt[1], pt[0]]]);
        } catch {}
      }
    };

    const handleMove = (clientX: number, clientY: number) => {
      if (!isPointerDown) return;
      const pt = getCoord(clientX, clientY);
      if (!pt) return;
      points.push(pt);
      if (drawingLayerRef.current) {
        try {
          drawingLayerRef.current.setLatLngs(points.map((p) => [p[1], p[0]]));
        } catch {}
      }
    };

    const handleEnd = () => {
      if (!isPointerDown) return;
      isPointerDown = false;
      if (points.length > 2) {
        setDrawnPoints(points);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      try {
        e.preventDefault();
        handleStart(e.clientX, e.clientY);
      } catch {}
    };
    const onMouseMove = (e: MouseEvent) => {
      try {
        handleMove(e.clientX, e.clientY);
      } catch {}
    };
    const onMouseUp = () => {
      try {
        handleEnd();
      } catch {}
    };

    const onTouchStart = (e: TouchEvent) => {
      try {
        if (e.touches[0]) {
          e.preventDefault();
          handleStart(e.touches[0].clientX, e.touches[0].clientY);
        }
      } catch {}
    };
    const onTouchMove = (e: TouchEvent) => {
      try {
        if (e.touches[0]) {
          handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      } catch {}
    };
    const onTouchEnd = () => {
      try {
        handleEnd();
      } catch {}
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDrawingMode]);

  // Geocoder Select
  const handlePlaceSelect = (place: PlaceSearchResult) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (place.bbox && place.bbox.length === 4) {
      map.fitBounds(
        [
          [place.bbox[1], place.bbox[0]],
          [place.bbox[3], place.bbox[2]],
        ],
        { padding: [60, 60], maxZoom: 15, duration: 0.9 }
      );
    } else {
      map.flyTo([place.center[1], place.center[0]], 14, { duration: 0.9 });
    }
  };

  // Validate drawing
  const handleValidateDrawing = () => {
    if (!drawnPoints || drawnPoints.length < 2) return;

    const deduped: Waypoint[] = [];
    for (const pt of drawnPoints) {
      const last = deduped[deduped.length - 1];
      if (!last || Math.abs(last[0] - pt[0]) > 1e-6 || Math.abs(last[1] - pt[1]) > 1e-6) {
        deduped.push(pt);
      }
    }

    let tolerance = 0.0001;
    let simplified = simplifyPoints(deduped, tolerance);
    while (simplified.length > 25 && tolerance < 0.01) {
      tolerance *= 1.5;
      simplified = simplifyPoints(deduped, tolerance);
    }

    onDrawWaypoints(simplified.slice(0, 30));
    setDrawnPoints(null);
    setIsDrawingMode(false);
  };

  return (
    <div
      className={cn(
        'relative size-full overflow-hidden',
        isDrawingMode && 'cursor-crosshair [&_*]:!cursor-crosshair'
      )}
    >
      <div ref={mapContainerRef} className="size-full" />

      {/* Top Floating Controls */}
      <div className="absolute left-4 top-4 z-[500] flex flex-col items-start gap-2.5">
        <PlaceSearch onSelect={handlePlaceSelect} />

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          aria-pressed={isDrawingMode}
          onClick={() => {
            if (isDrawingMode) {
              setIsDrawingMode(false);
              setDrawnPoints(null);
            } else {
              setDrawnPoints(null);
              setIsDrawingMode(true);
            }
          }}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-md backdrop-blur-xl transition-all duration-200',
            isDrawingMode
              ? 'bg-gradient-to-r from-[#fc5200] to-[#e34900] text-white shadow-[#fc5200]/30 ring-2 ring-[#ffd8c7]'
              : 'border border-[#e6e6e1] bg-white/90 text-[#1d1d1f] hover:bg-[#fff2eb]'
          )}
        >
          <Pencil className="size-3.5" />
          <span>{isDrawingMode ? 'Annuler le dessin' : 'Dessiner au crayon'}</span>
        </motion.button>
      </div>

      {/* Top Right Floating Controls (Basemap Selector) */}
      <div ref={layersMenuRef} className="absolute right-4 top-4 z-[500] flex flex-col items-end">
        <div className="relative">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            aria-label="Changer le fond de carte"
            aria-expanded={isLayersOpen}
            onClick={() => setIsLayersOpen((prev) => !prev)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold shadow-md backdrop-blur-xl transition-all duration-200',
              isLayersOpen
                ? 'border-[#fc5200] bg-gradient-to-r from-[#fc5200] to-[#e34900] text-white shadow-[#fc5200]/25'
                : 'border border-[#e6e6e1] bg-white/90 text-[#1d1d1f] hover:bg-[#fff2eb]'
            )}
          >
            <Layers className={cn('size-3.5', isLayersOpen ? 'text-white' : 'text-[#fc5200]')} />
            <span>Fond de carte</span>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                isLayersOpen ? 'bg-white/20 text-white' : 'bg-[#f4f4f0] text-[#484848]'
              )}
            >
              {BASEMAPS.find((b) => b.id === selectedBasemap)?.shortLabel || 'OSM'}
            </span>
          </motion.button>

          <AnimatePresence>
            {isLayersOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-[#e6e6e1] bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl"
              >
                <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8c8c85]">
                  Fonds de carte certifiés (sans filigrane)
                </div>
                <div className="space-y-1">
                  {BASEMAPS.map((b) => {
                    const isSelected = selectedBasemap === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          setSelectedBasemap(b.id);
                          setIsLayersOpen(false);
                        }}
                        className={cn(
                          'flex w-full items-start justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors',
                          isSelected
                            ? 'bg-[#fff2eb] text-[#fc5200] font-semibold ring-1 ring-[#ffd8c7]'
                            : 'text-[#1d1d1f] hover:bg-[#f8f8f6]'
                        )}
                      >
                        <div className="pr-2">
                          <div className="font-semibold leading-tight">{b.label}</div>
                          <div className="mt-0.5 text-[10px] font-normal text-[#8c8c85] leading-normal">
                            {b.description}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="mt-1 inline-block size-2 shrink-0 rounded-full bg-[#fc5200] shadow-[0_0_8px_#fc5200]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 100 points maximum notification */}
      <AnimatePresence>
        {waypoints.length >= 100 && !isDrawingMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pointer-events-none absolute inset-x-0 top-4 z-[500] flex justify-center px-4"
          >
            <p className="rounded-full bg-[#e11d48] px-4 py-2 text-xs font-semibold text-white shadow-lg">
              Maximum de 100 points atteint.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Floating Interactive Hints & Controls */}
      <AnimatePresence mode="wait">
        {drawnPoints ? (
          <motion.div
            key="drawn-actions"
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="absolute bottom-5 left-1/2 z-[500] flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-[#e6e6e1] bg-white/95 p-1.5 shadow-xl backdrop-blur-xl"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDrawnPoints(null);
                if (drawingLayerRef.current) drawingLayerRef.current.setLatLngs([]);
              }}
            >
              <RotateCcw className="size-3.5" />
              <span>Recommencer</span>
            </Button>
            <Button size="sm" onClick={handleValidateDrawing}>
              <Check className="size-3.5" />
              <span>Valider le tracé</span>
            </Button>
          </motion.div>
        ) : isDrawingMode ? (
          <motion.div
            key="drawing-hint"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="pointer-events-none absolute bottom-5 left-1/2 z-[500] -translate-x-1/2 px-4"
          >
            <p className="rounded-full border border-[#ffd8c7] bg-[#fff2eb]/95 px-5 py-2.5 text-center text-xs font-semibold text-[#c43e00] shadow-lg backdrop-blur-xl">
              Mode Tracé Libre : Dessinez votre itinéraire d’un seul trait, il sera vectorisé automatiquement.
            </p>
          </motion.div>
        ) : waypoints.length > 0 ? (
          <motion.div
            key="waypoints-hint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-5 left-1/2 z-[500] flex -translate-x-1/2 flex-col items-center gap-2.5 px-4"
          >
            {showTip && waypoints.length >= 2 && waypoints.length < 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="flex w-[24rem] max-w-[calc(100vw-2rem)] items-start gap-2.5 rounded-2xl border border-[#e6e6e1] bg-white/95 py-2.5 pl-4 pr-2.5 text-xs font-medium text-[#1d1d1f] shadow-xl backdrop-blur-xl"
              >
                <Sparkles className="size-4 shrink-0 text-[#fc5200] mt-0.5" />
                <span className="flex-1 leading-relaxed">
                  <strong>Ajustement vectoriel</strong> : Déplacez un point pour recalculer instantanément le profil altimétrique et la vitesse.
                </span>
                <button
                  type="button"
                  onClick={() => setShowTip(false)}
                  aria-label="Masquer l’astuce"
                  className="flex size-5 shrink-0 items-center justify-center rounded-full text-[#666660] hover:bg-[#f3f3f0] transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              </motion.div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
              className="shadow-md hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors text-xs font-semibold uppercase tracking-wider"
            >
              <Trash2 className="size-3.5" />
              <span>Réinitialiser la trace</span>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="empty-hint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-none absolute inset-x-0 bottom-5 z-[500] flex justify-center px-4"
          >
            <p className="w-[22rem] max-w-full rounded-2xl border border-[#e6e6e1] bg-white/95 px-4 py-2.5 text-center text-xs font-medium text-[#666660] shadow-lg backdrop-blur-xl">
              Cliquez sur la carte pour définir les points de passage de votre session.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
