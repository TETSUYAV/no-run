import { ActivityDraft, Device } from './types';
import { DEVICES, DEFAULT_DEVICE_ID } from './constants';
import { haversineDistance, calculateSlopeFactor } from './routing';

export interface GenerateGPXOptions extends ActivityDraft {
  coordinates: [number, number][]; // [lng, lat]
  elevations?: number[];
}

export function generateGPX(options: GenerateGPXOptions): string {
  const {
    sport,
    coordinates,
    pace,
    paceVariation,
    heartRateEnabled,
    heartRate: baseHr,
    heartRateVariation,
    startTime,
    activityName,
    deviceId,
  } = options;

  if (coordinates.length < 2) {
    throw new Error('Au moins 2 coordonnées sont requises pour générer un GPX.');
  }

  const device = DEVICES.find((d) => d.id === deviceId) || DEVICES[1];
  const creator = device.creator;
  const recordsCadence = device.recordsCadence;

  // Calculate base speed in m/s
  let baseSpeedMs: number;
  if (sport === 'running') {
    // pace is min/km -> seconds per km = pace * 60 -> m/s = 1000 / (pace * 60)
    baseSpeedMs = 1000 / (pace * 60);
  } else if (sport === 'cycling') {
    // pace is km/h -> m/s = (pace * 1000) / 3600
    baseSpeedMs = (pace * 1000) / 3600;
  } else {
    // swimming: pace is min/100m -> seconds per 100m = pace * 60 -> m/s = 100 / (pace * 60)
    baseSpeedMs = 100 / (pace * 60);
  }

  // Base Cadence
  const baseCadence = sport === 'running' ? 172 : sport === 'cycling' ? 86 : 32;

  // Start Date
  const startTimestampMs = new Date(startTime).getTime();

  // Approximate elevations if not provided
  const elevations =
    options.elevations && options.elevations.length === coordinates.length
      ? options.elevations
      : coordinates.map((c, idx) => 35 + Math.sin(idx * 0.1) * 10);

  // Phase 1: Interpolate coordinates into discrete track points (~3 to 8m apart)
  interface InterpolatedPoint {
    lat: number;
    lon: number;
    ele: number;
  }

  const rawPoints: InterpolatedPoint[] = [];

  for (let i = 0; i < coordinates.length - 1; i++) {
    const p1 = coordinates[i];
    const p2 = coordinates[i + 1];
    const ele1 = elevations[i];
    const ele2 = elevations[i + 1];

    const segDist = haversineDistance(p1, p2);
    // Interpolation distance (~3 to 8m based on speed)
    const stepDist = Math.max(3, Math.min(8, baseSpeedMs * 1.5));
    const numSubsteps = Math.max(1, Math.round(segDist / stepDist));

    for (let step = 0; step < numSubsteps; step++) {
      const fraction = step / numSubsteps;
      rawPoints.push({
        lon: p1[0] + (p2[0] - p1[0]) * fraction,
        lat: p1[1] + (p2[1] - p1[1]) * fraction,
        ele: ele1 + (ele2 - ele1) * fraction,
      });
    }
  }

  // Append the destination point
  const lastCoord = coordinates[coordinates.length - 1];
  const lastEle = elevations[elevations.length - 1];
  rawPoints.push({
    lon: lastCoord[0],
    lat: lastCoord[1],
    ele: lastEle,
  });

  // Phase 2: Compute subsegment distances and unscaled physiological durations
  const segmentStats: {
    dist: number;
    slope: number;
    unscaledDuration: number;
  }[] = [];

  let totalDistanceM = 0;

  for (let k = 0; k < rawPoints.length - 1; k++) {
    const pt1 = rawPoints[k];
    const pt2 = rawPoints[k + 1];
    const dist = haversineDistance([pt1.lon, pt1.lat], [pt2.lon, pt2.lat]);
    const slope = dist > 0 ? (pt2.ele - pt1.ele) / dist : 0;

    // Physiological slope speed factor (GAP Minetti model)
    const slopeFactor = calculateSlopeFactor(slope, sport);
    // Pace micro-variations controlled by regularity slider
    const noise = (Math.random() - 0.5) * 1.5 * paceVariation;
    const speedFactor = Math.max(0.2, slopeFactor * (1 + noise));

    const unscaledDuration = dist / (baseSpeedMs * speedFactor);

    totalDistanceM += dist;
    segmentStats.push({ dist, slope, unscaledDuration });
  }

  // Phase 3: Exact Target Duration according to user's selected pace
  let targetTotalSeconds: number;
  if (sport === 'running') {
    // pace in min/km -> total seconds = (dist / 1000) * pace * 60
    targetTotalSeconds = (totalDistanceM / 1000) * (pace * 60);
  } else if (sport === 'cycling') {
    // pace in km/h -> total seconds = ((dist / 1000) / pace) * 3600
    targetTotalSeconds = ((totalDistanceM / 1000) / pace) * 3600;
  } else {
    // swimming: pace in min/100m -> total seconds = (dist / 100) * pace * 60
    targetTotalSeconds = (totalDistanceM / 100) * (pace * 60);
  }

  const sumUnscaled = segmentStats.reduce((acc, s) => acc + s.unscaledDuration, 0);
  // Normalization factor K so that sum(scaledDuration) === targetTotalSeconds
  const timeScale = sumUnscaled > 0 ? targetTotalSeconds / sumUnscaled : 1;

  // Phase 4: Generate timestamped GPX trackpoints
  const trackPoints: {
    lat: number;
    lon: number;
    ele: number;
    time: string;
    hr?: number;
    cad?: number;
  }[] = [];

  let currentHr = baseHr - 12;
  let totalElapsedSeconds = 0;
  let cumulativeTimeMs = startTimestampMs;

  // Initial trackpoint at t0
  trackPoints.push({
    lat: rawPoints[0].lat,
    lon: rawPoints[0].lon,
    ele: Math.round(rawPoints[0].ele * 10) / 10,
    time: new Date(startTimestampMs).toISOString(),
    hr: heartRateEnabled ? Math.round(currentHr) : undefined,
    cad: recordsCadence ? baseCadence : undefined,
  });

  for (let k = 0; k < segmentStats.length; k++) {
    const seg = segmentStats[k];
    const nextPt = rawPoints[k + 1];
    const stepDurationSec = seg.unscaledDuration * timeScale;

    totalElapsedSeconds += stepDurationSec;

    // Avoid floating point drift; ensure exact end timestamp on final point
    if (k === segmentStats.length - 1) {
      cumulativeTimeMs = startTimestampMs + Math.round(targetTotalSeconds) * 1000;
    } else {
      cumulativeTimeMs += stepDurationSec * 1000;
    }

    let hrVal: number | undefined;
    let cadVal: number | undefined;

    if (heartRateEnabled) {
      // HR: progressive warmup over 3 minutes
      const warmupFactor = Math.min(1, totalElapsedSeconds / 180);
      const warmupStartHr = Math.max(90, baseHr - 22);
      const warmedUpBase = warmupStartHr + (baseHr - warmupStartHr) * warmupFactor;

      // Climbs increase HR (+5 to +25 bpm), descents lower HR (-5 bpm)
      const hrSlopeAdd = Math.max(-5, Math.min(25, seg.slope * 180));
      // Natural cardiac drift
      const drift = (totalElapsedSeconds / 1800) * 3;
      const hrJitter = (Math.random() - 0.5) * 4 * (1 + heartRateVariation * 2);

      const targetHr = warmedUpBase + hrSlopeAdd + drift + hrJitter;
      currentHr = currentHr * 0.92 + targetHr * 0.08;
      hrVal = Math.round(Math.max(50, Math.min(210, currentHr)));
    }

    if (recordsCadence) {
      const cadSlopeAdjust = Math.max(-8, Math.min(6, -seg.slope * 80));
      const cadNoise = (Math.random() - 0.5) * 3;
      cadVal = Math.round(Math.max(40, baseCadence + cadSlopeAdjust + cadNoise));
    }

    trackPoints.push({
      lat: nextPt.lat,
      lon: nextPt.lon,
      ele: Math.round(nextPt.ele * 10) / 10,
      time: new Date(Math.round(cumulativeTimeMs)).toISOString(),
      hr: hrVal,
      cad: cadVal,
    });
  }

  // Sport type for GPX
  const gpxType = sport === 'running' ? 'Run' : sport === 'cycling' ? 'Ride' : 'Swim';

  // Build XML
  const gpxXml = `<?xml version="1.0" encoding="UTF-8"?>
<gpx creator="${escapeXml(creator)}" version="1.1"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd">
  <metadata>
    <name>${escapeXml(activityName)}</name>
    <time>${trackPoints[0]?.time || new Date(startTimestampMs).toISOString()}</time>
  </metadata>
  <trk>
    <name>${escapeXml(activityName)}</name>
    <type>${gpxType}</type>
    <trkseg>
${trackPoints
  .map((pt) => {
    let extXml = '';
    if (pt.hr !== undefined || pt.cad !== undefined) {
      const hrTag = pt.hr !== undefined ? `\n          <gpxtpx:hr>${pt.hr}</gpxtpx:hr>` : '';
      const cadTag = pt.cad !== undefined ? `\n          <gpxtpx:cad>${pt.cad}</gpxtpx:cad>` : '';
      extXml = `\n      <extensions>\n        <gpxtpx:TrackPointExtension>${hrTag}${cadTag}\n        </gpxtpx:TrackPointExtension>\n      </extensions>`;
    }
    return `      <trkpt lat="${pt.lat.toFixed(6)}" lon="${pt.lon.toFixed(6)}">\n        <ele>${pt.ele.toFixed(1)}</ele>\n        <time>${pt.time}</time>${extXml}\n      </trkpt>`;
  })
  .join('\n')}
    </trkseg>
  </trk>
</gpx>`;

  return gpxXml;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}
