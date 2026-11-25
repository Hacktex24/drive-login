import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Desktop OAuth launcher, not an identity provider or Google token broker.
// This endpoint never receives authorization codes or refresh tokens.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const specifiedClient = (q.get('client_id') || '').trim();
  const fixedClient = (process.env.MOSMEX_GOOGLE_DESKTOP_CLIENT_ID || '').trim();
  if (fixedClient && specifiedClient && fixedClient !== specifiedClient) {
    return NextResponse.json({ error: 'El Client ID no coincide con la configuración del portal.' }, { status: 400 });
  }
  const clientId = fixedClient || specifiedClient;
  if (!/^[0-9]+-[A-Za-z0-9_-]+\.apps\.googleusercontent\.com$/.test(clientId)) {
    return NextResponse.json({ error: 'Falta un Google Desktop OAuth Client ID válido.' }, { status: 400 });
  }

  const state = q.get('state') || '';
  const challenge = q.get('challenge') || '';
  const returnTo = q.get('redirect_uri') || '';
  if (!/^[A-Za-z0-9_-]{32,128}$/.test(state) || !/^[A-Za-z0-9_-]{43,128}$/.test(challenge)) {
    return NextResponse.json({ error: 'Parámetros OAuth PKCE inválidos.' }, { status: 400 });
  }

  let redirect: URL;
  try { redirect = new URL(returnTo); }
  catch { return NextResponse.json({ error: 'URL de retorno inválida.' }, { status: 400 }); }
  if (redirect.protocol !== 'http:' || redirect.hostname !== '127.0.0.1' ||
      !/^[0-9]{1,5}$/.test(redirect.port) || !(Number(redirect.port) > 1023 && Number(redirect.port) <= 65535) ||
      redirect.pathname !== '/oauth/callback' || redirect.username || redirect.password ||
      redirect.search || redirect.hash) {
    return NextResponse.json({ error: 'Solo se acepta 127.0.0.1 y callback local autorizado.' }, { status: 400 });
  }

  const google = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  const values: Record<string,string> = {
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirect.toString(),
    scope: 'https://www.googleapis.com/auth/drive.file',
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    access_type: 'offline',
    prompt: 'consent',
  };
  Object.entries(values).forEach(([key,value]) => google.searchParams.set(key,value));
  const response = NextResponse.redirect(google.toString(),302);
  response.headers.set('Cache-Control','no-store, max-age=0');
  response.headers.set('Referrer-Policy','no-referrer');
  response.headers.set('X-Content-Type-Options','nosniff');
  return response;
}
