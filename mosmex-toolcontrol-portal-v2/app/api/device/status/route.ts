import { authenticateDevice, readGrant, errorJSON } from '../../../../lib/pairing';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(req:Request){
 try {
   const body=await req.json();
   const device=await authenticateDevice(body);
   if(!device)return errorJSON('Sesión o código caducado.',403);
   const envelope=await readGrant(device.id);
   return Response.json(envelope?{status:'approved',envelope}:{status:'pending'},
      {headers:{'Cache-Control':'no-store','Pragma':'no-cache'}});
 }catch{return errorJSON('No se pudo consultar el PIN.',503);}
}
