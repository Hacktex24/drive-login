import { NextRequest,NextResponse } from 'next/server';
import {oauthKey,deviceKey,resultKey,codeKey,redis,publicUrl,sealToDevice,configured,noCache} from '../../../../lib/pin-core';
export const runtime='nodejs';export const dynamic='force-dynamic';
function page(message:string,ok=false){return new NextResponse('<!doctype html><html lang="es"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MOSMEX | Vinculación</title><body style="font:17px Segoe UI,Arial;background:#eef5f7;color:#123e51;text-align:center;padding:12vh 20px"><h1>MOSMEX ToolControl</h1><p>'+message+'</p><p>Regresa a ToolControl en tu PC.</p></body></html>',
  {status:ok?200:400,headers:{...noCache,'Content-Type':'text/html; charset=utf-8'}});}
export async function GET(req:NextRequest){
 try{
  if(!configured())return page('El servicio de vinculación todavía no está configurado.');
  const q=req.nextUrl.searchParams;
  const state=q.get('state')||'';
  if(!/^[A-Za-z0-9_-]{43}$/.test(state) || req.cookies.get('mosmex_oauth_state')?.value!==state)
    return page('Sesión de autorización no reconocida o caducada.');
  if(q.has('error'))return page('Google no autorizó el acceso.');
  const code=q.get('code')||'';if(!code||code.length>4096)return page('Google no devolvió un código válido.');
  const oauthRaw=await redis('GETDEL',oauthKey(state));if(!oauthRaw)return page('Solicitud de vinculación caducada.');
  const {device,verifier}=JSON.parse(oauthRaw);
  const raw=await redis('GET',deviceKey(device));
  if(!raw)return page('El PIN de vinculación caducó.');
  const pair=JSON.parse(raw);
  if(pair.status!=='pending'||!pair.publicKey)return page('La vinculación ya fue completada.');
  const tokenBody=new URLSearchParams({code,client_id:process.env.MOSMEX_GOOGLE_WEB_CLIENT_ID!,
    client_secret:process.env.MOSMEX_GOOGLE_WEB_CLIENT_SECRET!,
    redirect_uri:publicUrl()+'/api/pair/callback',grant_type:'authorization_code',code_verifier:verifier});
  const response=await fetch('https://oauth2.googleapis.com/token',{method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},body:tokenBody.toString(),cache:'no-store'});
  if(!response.ok)return page('Google no completó la autorización. Reinicia la vinculación desde ToolControl.');
  const tokens=await response.json();
  if(!tokens.refresh_token || !tokens.access_token ||
     !String(tokens.scope||'').split(/\s+/).includes('https://www.googleapis.com/auth/drive.file'))
    return page('Google no concedió el permiso de respaldo o faltó el token de renovación.');
  const envelope=sealToDevice(device,pair.publicKey,{
    mode:'pin_web',token:String(tokens.access_token),refresh_token:String(tokens.refresh_token),
    client_id:process.env.MOSMEX_GOOGLE_WEB_CLIENT_ID,
    token_uri:'https://oauth2.googleapis.com/token',scopes:['https://www.googleapis.com/auth/drive.file'],
    portal_url:publicUrl(),expires_in:Number(tokens.expires_in||3600)
  });
  await redis('SET',resultKey(device),JSON.stringify(envelope),'EX',600);
  pair.status='ready';await redis('SET',deviceKey(device),JSON.stringify(pair),'EX',600);
  await redis('DEL',codeKey(pair.code));
  const done=page('Google Drive autorizado. La PC recibirá la vinculación de forma automática.',true);
  done.cookies.delete('mosmex_oauth_state');
  return done;
 }catch{return page('No fue posible completar la autorización. Inténtalo nuevamente desde ToolControl.');}
}
