import { NextRequest,NextResponse } from 'next/server';
import {configured,smallJSON,throttle,noCache} from '../../../../lib/pin-core';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(req:NextRequest) {
 try {
  if(!configured())return NextResponse.json({error:'Servicio OAuth sin configurar.'},{status:503,headers:noCache});
  await throttle(req,'refresh',80);
  const payload=await smallJSON(req,4096);
  const refresh=String(payload.refresh_token||'');
  if(refresh.length<20||refresh.length>3000)return NextResponse.json({error:'Credencial inválida.'},{status:400,headers:noCache});
  const body=new URLSearchParams({refresh_token:refresh,grant_type:'refresh_token',
    client_id:process.env.MOSMEX_GOOGLE_WEB_CLIENT_ID!,client_secret:process.env.MOSMEX_GOOGLE_WEB_CLIENT_SECRET!});
  const response=await fetch('https://oauth2.googleapis.com/token',{method:'POST',
     headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body.toString(),cache:'no-store'});
  if(!response.ok)return NextResponse.json({error:'Se debe volver a vincular la cuenta Google.'},{status:401,headers:noCache});
  const data=await response.json();
  if(!data.access_token)return NextResponse.json({error:'Google rechazó la renovación.'},{status:502,headers:noCache});
  return NextResponse.json({access_token:data.access_token,expires_in:data.expires_in||3600,
    refresh_token:data.refresh_token||null,token_type:'Bearer'}, {headers:noCache});
 }catch{return NextResponse.json({error:'No se pudo renovar la conexión Google.'},{status:503,headers:noCache});}
}
