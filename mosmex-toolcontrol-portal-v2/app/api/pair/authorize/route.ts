import { NextRequest,NextResponse } from 'next/server';
import {configured,normalizePin,validPin,codeKey,deviceKey,redis,oauthKey,b64url,TTL,publicUrl,throttle,noCache} from '../../../../lib/pin-core';
import {createHash} from 'node:crypto';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(req:NextRequest){
 try {
  const url=publicUrl();
  if(req.headers.get('origin')!==url)return new NextResponse('Origen no autorizado.',{status:403,headers:noCache});
  if(!configured())return new NextResponse('La vinculación está pendiente de configuración administrativa.',{status:503,headers:noCache});
  await throttle(req,'pin',12);
  const form=await req.formData();
  const pin=normalizePin(String(form.get('pin')||''));
  if(!validPin(pin))return new NextResponse('Código inválido.',{status:400,headers:noCache});
  const device=await redis('GET',codeKey(pin));
  if(!device)return new NextResponse('Código caducado o no reconocido.',{status:404,headers:noCache});
  const record=await redis('GET',deviceKey(device));
  if(!record||JSON.parse(record).status!=='pending')return new NextResponse('Código ya utilizado o caducado.',{status:409,headers:noCache});
  const state=b64url(32); const verifier=b64url(48);
  await redis('SET',oauthKey(state),JSON.stringify({device,verifier}),'EX',TTL);
  const challenge=createHash('sha256').update(verifier).digest('base64url');
  const google=new URL('https://accounts.google.com/o/oauth2/v2/auth');
  Object.entries({
   response_type:'code',client_id:process.env.MOSMEX_GOOGLE_WEB_CLIENT_ID!,
   redirect_uri:url+'/api/pair/callback',
   scope:'https://www.googleapis.com/auth/drive.file',
   access_type:'offline',prompt:'consent',state,
   code_challenge:challenge,code_challenge_method:'S256'
  }).forEach(([key,value])=>google.searchParams.set(key,value));
  const response=NextResponse.redirect(google.toString(),303);
  response.cookies.set('mosmex_oauth_state',state,{httpOnly:true,secure:true,sameSite:'lax',path:'/api/pair/callback',maxAge:TTL});
  Object.entries(noCache).forEach(([key,val])=>response.headers.set(key,val));
  return response;
 }catch{return new NextResponse('No se pudo iniciar la vinculación. Revisa el PIN.',{status:400,headers:noCache});}
}
