import { NextResponse } from 'next/server';
import fs from 'fs';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const line = `[${new Date().toISOString()}] ${JSON.stringify(data)}\n`;
    fs.appendFileSync('/tmp/ghostpace-client-error.log', line);
    console.error('CLIENT_ERROR_LOGGED:', data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
