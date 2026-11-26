import { NextRequest,NextResponse } from 'next/server';
import { b64url, pin,redis,TTL,codeKey,deviceKey,configured,validatePublicKey,smallJSON,throttle,publicUrl,noCache,Pair } from '../../../../lib/pin-core';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(req:NextRequest) {
  try {
    if(!configured())return NextResponse.json({error:'Servicio de PIN pendiente de configuración administrativa.'},{status:503,headers:noCache});
    await throttle(req,'start',30);
    const body=await smallJSON(req);
    validatePublicKey(String(body.device_public_key||''));
    const device=b64url(32);
    for(let attempt=0;attempt<4;attempt++) {
      const code=pin();
      const claimed=await redis('SET',codeKey(code),device,'EX',TTL,'NX');
      if(claimed!=='OK')continue;
      const record:Pair={device,code,publicKey:body.device_public_key,status:'pending',created:Date.now()};
      await redis('SET',deviceKey(device),JSON.stringify(record),'EX',TTL);
      return NextResponse.json({device_code:device,user_code:code.slice(0,4)+'-'+code.slice(4),verification_uri:publicUrl()+'/activate',interval:4,expires_in:TTL},
        {status:201,headers:noCache});
    }
    throw new Error('No se pudo generar un código disponible.');
  }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'No se pudo generar el PIN.'},{status:400,headers:noCache});}
}
