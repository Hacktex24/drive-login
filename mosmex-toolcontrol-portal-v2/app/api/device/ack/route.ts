import { authenticateDevice, ackDevice, errorJSON } from '../../../../lib/pairing';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(req:Request){
 try{
  const body=await req.json();
  const d=await authenticateDevice(body);
  if(!d)return errorJSON('Sesión vencida.',403);
  await ackDevice(d);
  return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});
 }catch{return errorJSON('No se pudo cerrar el emparejamiento.',503);}
}
