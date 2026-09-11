import { NextRequest, NextResponse } from 'next/server';
import { fetchRoute } from '@/lib/routing';
import { Sport, Waypoint } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const waypoints: Waypoint[] = body.waypoints || [];
    const sport: Sport = body.sport || 'running';
    const snapToRoads: boolean = body.snapToRoads ?? (sport !== 'swimming');

    if (!Array.isArray(waypoints) || waypoints.length < 2) {
      return NextResponse.json(
        { message: 'Au moins 2 waypoints sont nécessaires.' },
        { status: 400 }
      );
    }

    const result = await fetchRoute(waypoints, sport, snapToRoads);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('API route error:', err);
    return NextResponse.json(
      { message: 'Erreur lors du calcul du tracé.' },
      { status: 500 }
    );
  }
}
