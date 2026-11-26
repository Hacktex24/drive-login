import { NextRequest, NextResponse } from 'next/server';
import { PORTAL, backendReady, resolvePIN, startWebOAuth } from '../../../../lib/pairing';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(req:NextRequest){
  if(!backendReady())return NextResponse.redirect(PORTAL+'/vincular?error=setup',303);
  try {
    if(Number(req.headers.get('content-length')||'0')>4096)return NextResponse.redirect(PORTAL+'/vincular?error=invalid',303);
    const origin=req.headers.get('origin');
    if(origin && origin!==PORTAL)return NextResponse.redirect(PORTAL+'/vincular?error=invalid',303);
    const form=await req.formData();
    const dev=await resolvePIN(String(form.get('code')||''));
    if(!dev)return NextResponse.redirect(PORTAL+'/vincular?error=invalid',303);
    const destination=await startWebOAuth(dev);
    const res=NextResponse.redirect(destination,303);
    res.headers.set('Cache-Control','no-store');
    res.headers.set('Referrer-Policy','no-referrer');
    return res;
  }catch{return NextResponse.redirect(PORTAL+'/vincular?error=invalid',303);}
}
