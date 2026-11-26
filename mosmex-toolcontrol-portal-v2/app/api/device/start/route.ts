import { backendReady, createDevice, errorJSON } from '../../../../lib/pairing';
export const runtime='nodejs'; export const dynamic='force-dynamic';
export async function POST(req:Request){
  if(!backendReady())return errorJSON('El emparejamiento necesita completar la configuración administrativa en Vercel.',503);
  try {
    if(Number(req.headers.get('content-length')||'0')>8192)return errorJSON('Solicitud demasiado grande.',413);
    const body=await req.json();
    if(!body||typeof body.public_key!=='string')return errorJSON('Falta la llave pública de la PC.');
    return Response.json(await createDevice(body.public_key),{headers:{'Cache-Control':'no-store'}});
  }catch {return errorJSON('No se pudo generar el PIN. Comprueba la configuración de almacenamiento privado.',503);}
}
