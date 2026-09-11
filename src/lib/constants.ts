import { Device, Sport } from './types';

export const ALL_SPORTS: Sport[] = ['running', 'cycling', 'swimming'];

export const DEVICES: Device[] = [
  {
    id: 'phone',
    label: 'Téléphone (application Strava)',
    creator: 'StravaGPX',
    sports: ALL_SPORTS,
    recordsCadence: false,
  },
  {
    id: 'garmin-forerunner-265',
    label: 'Garmin Forerunner 265',
    creator: 'Garmin Forerunner 265',
    sports: ALL_SPORTS,
    recordsCadence: true,
  },
  {
    id: 'garmin-forerunner-965',
    label: 'Garmin Forerunner 965',
    creator: 'Garmin Forerunner 965',
    sports: ALL_SPORTS,
    recordsCadence: true,
  },
  {
    id: 'garmin-fenix-7x',
    label: 'Garmin Fenix 7X',
    creator: 'Garmin Fenix 7X',
    sports: ALL_SPORTS,
    recordsCadence: true,
  },
  {
    id: 'garmin-fenix-8',
    label: 'Garmin Fenix 8',
    creator: 'Garmin Fenix 8',
    sports: ALL_SPORTS,
    recordsCadence: true,
  },
  {
    id: 'garmin-edge-840',
    label: 'Garmin Edge 840',
    creator: 'Garmin Edge 840',
    sports: ['cycling'],
    recordsCadence: true,
  },
  {
    id: 'coros-pace-3',
    label: 'Coros Pace 3',
    creator: 'COROS PACE 3',
    sports: ALL_SPORTS,
    recordsCadence: true,
  },
  {
    id: 'coros-apex-2-pro',
    label: 'Coros Apex 2 Pro',
    creator: 'COROS APEX 2 Pro',
    sports: ALL_SPORTS,
    recordsCadence: true,
  },
  {
    id: 'polar-vantage-v3',
    label: 'Polar Vantage V3',
    creator: 'Polar Vantage V3',
    sports: ALL_SPORTS,
    recordsCadence: true,
  },
  {
    id: 'suunto-race',
    label: 'Suunto Race',
    creator: 'Suunto Race',
    sports: ALL_SPORTS,
    recordsCadence: true,
  },
  {
    id: 'apple-watch-ultra-2',
    label: 'Apple Watch Ultra 2',
    creator: 'Apple Watch Ultra 2',
    sports: ALL_SPORTS,
    recordsCadence: true,
  },
  {
    id: 'apple-watch-series-10',
    label: 'Apple Watch Series 10',
    creator: 'Apple Watch Series 10',
    sports: ALL_SPORTS,
    recordsCadence: true,
  },
  {
    id: 'wahoo-elemnt-bolt',
    label: 'Wahoo Elemnt Bolt',
    creator: 'Wahoo ELEMNT BOLT',
    sports: ['cycling'],
    recordsCadence: true,
  },
];

export const DEFAULT_DEVICE_ID = 'garmin-forerunner-265';

export const SPORT_LABELS: Record<Sport, string> = {
  running: 'Course à pied',
  cycling: 'Vélo',
  swimming: 'Natation en eau libre',
};

export const SPORT_DEFAULTS = {
  running: {
    pace: 5.5, // 5:30 /km
    min: 1,
    max: 20,
    step: 0.05,
    activityName: 'Morning Run',
    supportsSnapping: true,
  },
  cycling: {
    pace: 25, // 25 km/h
    min: 1,
    max: 200,
    step: 0.5,
    activityName: 'Morning Ride',
    supportsSnapping: true,
  },
  swimming: {
    pace: 2, // 2:00 /100m
    min: 1 / 3,
    max: 8,
    step: 1 / 60,
    activityName: 'Morning Swim',
    supportsSnapping: false,
  },
};

export function getDevicesForSport(sport: Sport): Device[] {
  return DEVICES.filter((d) => d.sports.includes(sport));
}

export function regularityLabel(variation: number): string {
  if (variation < 0.02) return 'Métronome';
  if (variation < 0.12) return 'Cadencé';
  if (variation < 0.25) return 'Organique';
  return 'Explosif';
}

export function sportUnitLabel(sport: Sport): string {
  switch (sport) {
    case 'running':
      return 'min/km';
    case 'cycling':
      return 'km/h';
    case 'swimming':
      return 'min/100 m';
  }
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const km = (meters / 1000).toFixed(2).replace('.', ',');
  return `${km} km`;
}

export function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  if (h > 0) {
    return `${h}:${pad(m)}:${pad(s)}`;
  }
  return `${m}:${pad(s)}`;
}

export function formatPaceValue(sport: Sport, val: number): string {
  switch (sport) {
    case 'running': {
      const totalSec = Math.round(val * 60);
      const m = Math.floor(totalSec / 60);
      const s = totalSec % 60;
      return `${m}:${String(s).padStart(2, '0')} /km`;
    }
    case 'swimming': {
      const totalSec = Math.round(val * 60);
      const m = Math.floor(totalSec / 60);
      const s = totalSec % 60;
      return `${m}:${String(s).padStart(2, '0')} /100 m`;
    }
    case 'cycling': {
      return Number.isInteger(val) ? `${val} km/h` : `${val.toFixed(1).replace('.', ',')} km/h`;
    }
  }
}

export function defaultStartTime(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}
