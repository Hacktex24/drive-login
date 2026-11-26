import { backendReady, webConfigValid } from '../../../lib/pairing';
export const dynamic='force-dynamic';
export function GET(){
 return Response.json({
  service:'mosmex-toolcontrol-oauth',version:'0.14.55',pin:true,
  status:backendReady()?'ready':'setup_required',
  googleWebOAuth:webConfigValid()?'configured':'missing',
  privateStorage:Boolean(process.env.BLOB_READ_WRITE_TOKEN||process.env.BLOB_STORE_ID)?'configured':'missing',
  storesCompanyInventory:false
 },{headers:{'Cache-Control':'no-store'}});
}
