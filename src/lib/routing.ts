import { Sport, Waypoint, RouteResult } from './types';

// Earth radius in meters
const R = 6371000;

export function haversineDistance(coord1: Waypoint, coord2: Waypoint): number {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateTotalDistance(coords: Waypoint[]): number {
  let dist = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    dist += haversineDistance(coords[i], coords[i + 1]);
  }
  return dist;
}

/**
 * Grade Adjusted Pace (GAP) / Physiological slope speed factor.
 * Based on Minetti's metabolic cost curve of running & cycling physics.
 * Returns a factor multiplying flat speed (e.g. 0.35 in steep climbs, ~1.15 in gentle descents).
 */
export function calculateSlopeFactor(slope: number, sport: Sport): number {
  if (sport === 'swimming') return 1.0;

  if (sport === 'running') {
    if (slope >= 0) {
      // Uphill: progressive realistic slowdown
      // +2% slope: ~0.85 (e.g. 5:30 -> ~6:28/km)
      // +5% slope: ~0.68 (e.g. 5:30 -> ~8:03/km)
      // +10% slope: ~0.50 (e.g. 5:30 -> ~11:00/km)
      // +15% slope: ~0.38 (e.g. 5:30 -> ~14:22/km)
      // +20% slope (Fourvière stairs): ~0.30 (e.g. 5:30 -> ~18:20/km - walking/hiking pace)
      return Math.max(0.28, 1 / (1 + slope * 8.5 + Math.pow(slope, 2) * 16));
    } else {
      // Downhill (slope < 0)
      const absSlope = Math.abs(slope);
      if (absSlope <= 0.08) {
        // Mild downhill: natural rolling speedup up to +24%
        return 1 + absSlope * 3.0;
      } else {
        // Steep downhill: runners brake to protect joints and control speed on stairs
        // Drops from 1.24 down to 0.90 at -20%
        return Math.max(0.85, 1.24 - (absSlope - 0.08) * 2.5);
      }
    }
  }

  if (sport === 'cycling') {
    if (slope >= 0) {
      // Cycling uphill: gravity significantly impedes velocity
      // +5% slope: ~0.58
      // +10% slope: ~0.38
      // +15% slope: ~0.28
      return Math.max(0.18, 1 / (1 + slope * 12 + Math.pow(slope, 2) * 25));
    } else {
      // Cycling downhill: gravity accelerates speed up to +80%
      const absSlope = Math.abs(slope);
      return Math.min(1.85, 1 + absSlope * 5.0);
    }
  }

  return 1.0;
}

/**
 * Fetch real digital elevation model data using Open-Meteo SRTM/Copernicus global API.
 * Free, fast, with high accuracy.
 */
export async function fetchRealElevations(
  coords: Waypoint[],
  signal?: AbortSignal
): Promise<{ elevations: number[]; gain: number }> {
  if (coords.length === 0) return { elevations: [], gain: 0 };
  if (coords.length === 1) return { elevations: [150], gain: 0 };

  try {
    // Sample up to 80 points along coords to stay within single URL length limits
    const maxSamples = 80;
    const sampleIndices: number[] = [];
    if (coords.length <= maxSamples) {
      for (let i = 0; i < coords.length; i++) sampleIndices.push(i);
    } else {
      for (let i = 0; i < maxSamples; i++) {
        sampleIndices.push(Math.round((i * (coords.length - 1)) / (maxSamples - 1)));
      }
    }

    const lats = sampleIndices.map((idx) => coords[idx][1].toFixed(5)).join(',');
    const lons = sampleIndices.map((idx) => coords[idx][0].toFixed(5)).join(',');

    const url = `https://api.open-meteo.com/v1/elevation?latitude=${lats}&longitude=${lons}`;
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });

    if (res.ok) {
      const data = await res.json();
      const sampledElevations: number[] = data.elevation;

      if (Array.isArray(sampledElevations) && sampledElevations.length === sampleIndices.length) {
        // Interpolate elevations for all coords between samples
        const fullElevations: number[] = new Array(coords.length);

        for (let s = 0; s < sampleIndices.length - 1; s++) {
          const idxStart = sampleIndices[s];
          const idxEnd = sampleIndices[s + 1];
          const eleStart = sampledElevations[s] ?? 100;
          const eleEnd = sampledElevations[s + 1] ?? 100;
          const count = idxEnd - idxStart;

          for (let k = idxStart; k <= idxEnd; k++) {
            const frac = count > 0 ? (k - idxStart) / count : 0;
            fullElevations[k] = Math.round((eleStart + (eleEnd - eleStart) * frac) * 10) / 10;
          }
        }
        fullElevations[coords.length - 1] =
          sampledElevations[sampledElevations.length - 1] ?? fullElevations[coords.length - 2] ?? 100;

        // Calculate positive elevation gain with subtle noise filter (min threshold 0.5m)
        let totalGain = 0;
        for (let i = 0; i < fullElevations.length - 1; i++) {
          const diff = fullElevations[i + 1] - fullElevations[i];
          if (diff > 0.4) {
            totalGain += diff;
          }
        }

        return { elevations: fullElevations, gain: Math.round(totalGain) };
      }
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') throw err;
    console.warn('Real elevation fetch failed, using fallback:', err);
  }

  // Fallback if API fails
  const elevations: number[] = [];
  let currentEle = 160;
  let totalGain = 0;

  for (let i = 0; i < coords.length; i++) {
    const [lon, lat] = coords[i];
    const wave = Math.sin(lat * 80 + lon * 60) * 15;
    const targetEle = Math.max(10, 160 + wave);
    if (i === 0) {
      currentEle = targetEle;
    } else {
      const d = targetEle - currentEle;
      const step = d * 0.1;
      const prev = currentEle;
      currentEle += step;
      if (currentEle > prev) totalGain += currentEle - prev;
    }
    elevations.push(Math.round(currentEle * 10) / 10);
  }

  return { elevations, gain: Math.round(totalGain) };
}

export async function fetchRoute(
  waypoints: Waypoint[],
  sport: Sport,
  snapToRoads: boolean,
  signal?: AbortSignal
): Promise<RouteResult> {
  if (waypoints.length < 2) {
    return {
      coordinates: waypoints,
      distanceM: 0,
      elevationGainM: 0,
    };
  }

  // If snapping is disabled or sport is swimming, connect straight lines
  if (!snapToRoads || sport === 'swimming') {
    const distanceM = calculateTotalDistance(waypoints);
    const { elevations, gain } = await fetchRealElevations(waypoints, signal);
    return {
      coordinates: waypoints,
      distanceM,
      elevationGainM: gain,
      elevations,
    };
  }

  // Use OSRM for road/path routing
  const profile = sport === 'cycling' ? 'bike' : 'foot';
  const coordsQuery = waypoints.map((pt) => `${pt[0]},${pt[1]}`).join(';');

  const osrmUrl = `https://routing.openstreetmap.de/routed-${profile}/route/v1/driving/${coordsQuery}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(osrmUrl, { signal, headers: { Accept: 'application/json' } });
    if (!res.ok) {
      throw new Error(`OSRM error: ${res.status}`);
    }
    const data = await res.json();
    if (data.code === 'Ok' && data.routes && data.routes[0]) {
      const route = data.routes[0];
      const coords: Waypoint[] = route.geometry.coordinates;
      const distanceM = route.distance ?? calculateTotalDistance(coords);
      const { elevations, gain } = await fetchRealElevations(coords, signal);
      return {
        coordinates: coords,
        distanceM,
        elevationGainM: gain,
        elevations,
      };
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') throw err;
    console.warn('OSRM routing failed or timed out, falling back to direct line', err);
  }

  // Fallback to straight line if OSRM fails
  const distanceM = calculateTotalDistance(waypoints);
  const { elevations, gain } = await fetchRealElevations(waypoints, signal);
  return {
    coordinates: waypoints,
    distanceM,
    elevationGainM: gain,
    elevations,
  };
}
