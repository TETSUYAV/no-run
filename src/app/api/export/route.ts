import { NextRequest, NextResponse } from 'next/server';
import { generateGPX } from '@/lib/gpx';
import { Sport } from '@/lib/types';
import { verifySessionToken, consumeExportCredit } from '@/lib/userStore';

// In-memory sliding window rate limiting (max 30 requests per minute per IP)
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequestCounts.get(ip);

  if (!entry || now > entry.resetTime) {
    ipRequestCounts.set(ip, { count: 1, resetTime: now + 60_000 });
    return true;
  }

  if (entry.count >= 30) {
    return false;
  }

  entry.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { message: 'Trop de requêtes générées. Veuillez patienter une minute.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    // 1. Authentification & Vérification de Session
    const token =
      req.cookies.get('norun_session')?.value ||
      req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

    let userId: string | null = null;
    if (token) {
      const payload = verifySessionToken(token);
      if (payload) {
        userId = payload.userId;
      }
    }

    if (!userId) {
      return NextResponse.json(
        {
          error: 'unauthorized',
          message: 'Veuillez vous connecter pour télécharger votre tracé (1er tracé offert).',
        },
        { status: 401 }
      );
    }

    // 2. Contrôle du Solde de Crédits / Abonnement
    const creditCheck = await consumeExportCredit(userId);
    if (!creditCheck.success) {
      return NextResponse.json(
        {
          error: 'insufficient_credits',
          message: 'Votre solde d’exports est épuisé. Rechargez un pack ou rejoignez le Club Alibi.',
          freeTrialAvailable: false,
          credits: creditCheck.user?.credits ?? 0,
        },
        { status: 402 }
      );
    }

    const body = await req.json();


    const sport: Sport = body.sport || 'running';
    const waypoints = body.waypoints || [];
    const coordinates = body.coordinates || waypoints;

    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      return NextResponse.json(
        { message: 'Au moins 2 points sont requis pour exporter.' },
        { status: 400 }
      );
    }

    // Protection anti-abus taille mémoire
    if (coordinates.length > 50_000) {
      return NextResponse.json(
        { message: 'Tracé trop volumineux (maximum 50 000 points).' },
        { status: 400 }
      );
    }

    let pace = 5.5;
    if (sport === 'running' && body.paceMinPerKm) {
      pace = body.paceMinPerKm;
    } else if (sport === 'cycling' && body.speedKmh) {
      pace = body.speedKmh;
    } else if (sport === 'swimming' && body.pacePer100m) {
      pace = body.pacePer100m;
    } else if (body.pace) {
      pace = body.pace;
    }

    const gpxXml = generateGPX({
      sport,
      waypoints,
      coordinates,
      pace,
      paceVariation: body.paceVariation ?? 0.08,
      heartRateEnabled: !!body.heartRate,
      heartRate: body.heartRate?.baseHr ?? 155,
      heartRateVariation: body.heartRate?.variation ?? 0.05,
      startTime: body.startTime || new Date().toISOString(),
      activityName: body.activityName || 'Morning Run',
      snapToRoads: body.snapToRoads ?? true,
      deviceId: body.deviceId || 'garmin-forerunner-265',
      elevations: body.elevations,
    });

    const safeFilename = (body.activityName || 'activite')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const filename = `${safeFilename || 'activite'}.gpx`;

    return new Response(gpxXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/gpx+xml; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-RateLimit-Limit': '30',
        'X-NoRun-Credit-Reason': creditCheck.reason,
        'X-NoRun-Credits-Remaining': (creditCheck.user?.credits ?? 0).toString(),
      },
    });
  } catch (err: any) {
    console.error('Export error:', err);
    return NextResponse.json(
      { message: err?.message || 'Erreur lors de la génération du fichier GPX.' },
      { status: 500 }
    );
  }
}
