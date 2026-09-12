export type Sport = 'running' | 'cycling' | 'swimming';

export type Waypoint = [number, number]; // [lng, lat]

export interface Device {
  id: string;
  label: string;
  creator: string;
  sports: Sport[];
  recordsCadence: boolean;
}

export interface ActivityDraft {
  sport: Sport;
  waypoints: Waypoint[];
  pace: number; // min/km for running, km/h for cycling, min/100m for swimming
  paceVariation: number; // 0 to 0.5
  heartRateEnabled: boolean;
  heartRate: number; // bpm e.g. 155
  heartRateVariation: number; // 0 to 0.4 e.g. 0.05
  startTime: string; // "YYYY-MM-DDTHH:mm"
  activityName: string;
  snapToRoads: boolean;
  deviceId: string;
}

export interface RouteResult {
  coordinates: Waypoint[];
  distanceM: number;
  elevationGainM: number;
  elevations?: number[];
  estimatedDurationSec?: number;
}

export interface PlaceSearchResult {
  id: string;
  nom: string;
  center: [number, number]; // [lng, lat]
  bbox?: [number, number, number, number];
}

export type PricingProductId = 'pack_3' | 'pack_10' | 'club_monthly' | 'club_yearly';

export interface UserSubscription {
  status: 'active' | 'canceled' | 'none';
  plan: 'club_monthly' | 'club_yearly' | null;
  currentPeriodEnd?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  credits: number;
  freeTrialAvailable: boolean;
  subscription: UserSubscription;
  stripeCustomerId?: string;
  createdAt: string;
}

