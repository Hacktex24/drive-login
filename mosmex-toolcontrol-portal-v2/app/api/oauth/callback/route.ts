import { NextRequest, NextResponse } from 'next/server';
import { finishWebOAuth } from '../../../../lib/pairing';
export const runtime='nodejs';export const dynamic='force-dynamic';
function resultPage(success:boolean){
 const message=success?'Google Drive quedó vinculado con tu computadora.':'No se pudo completar la autorización. Vuelve a generar un PIN en ToolControl.';
 const title=success?'Autorización completada':'Autorización no completada';
 const mark=success?'✓':'!';
 const html='<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>MOSMEX · '+title+'</title></head><body style="background:#f2f7fa;font-family:Arial,sans-serif;color:#10334c;display:grid;place-items:center;min-height:85vh"><main style="max-width:530px;margin:20px;padding:34px;background:white;border:1px solid #d6e3ee;border-radius:20px;text-align:center"><h1 style="color:#087f92">'+mark+' '+title+'</h1><p style="line-height:1.65">'+message+'</p><p>Puedes cerrar esta página y volver a ToolControl.</p></main></body></html>';
 return new NextResponse(html,{status:success?200:400,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'}});
}
export async function GET(req:NextRequest){
 const q=req.nextUrl.searchParams;
 if(q.has('error'))return resultPage(false);
 try {
  const code=q.get('code')||'', state=q.get('state')||'';
  await finishWebOAuth(code,state);
  return resultPage(true);
 }catch{return resultPage(false);}
}
