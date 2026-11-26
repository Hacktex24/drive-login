import { errorJSON, renewAccess, webConfigValid } from '../../../../lib/pairing';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(req:Request){
 if(!webConfigValid())return errorJSON('Servicio OAuth no configurado.',503);
 try{
  if(Number(req.headers.get('content-length')||'0')>9000)return errorJSON('Solicitud demasiado grande.',413);
  const body=await req.json();
  if(typeof body?.refresh_token!=='string'||typeof body?.refresh_ticket!=='string')
   return errorJSON('Credencial de renovación inválida.',403);
  return Response.json(await renewAccess(body.refresh_token,body.refresh_ticket),
   {headers:{'Cache-Control':'no-store','Pragma':'no-cache'}});
 }catch{return errorJSON('La autorización de Google debe renovarse mediante un nuevo PIN.',401);}
}
