import { NextRequest,NextResponse } from 'next/server';
import {deviceKey,resultKey,smallJSON,redis,noCache,throttle} from '../../../../lib/pin-core';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(req:NextRequest){
  try{
    await throttle(req,'poll',300);
    const {device_code}=await smallJSON(req,1024);
    if(typeof device_code!=='string'||!/^[A-Za-z0-9_-]{43}$/.test(device_code))
      return NextResponse.json({error:'Código de dispositivo inválido.'},{status:400,headers:noCache});
    const raw=await redis('GET',deviceKey(device_code));
    if(!raw)return NextResponse.json({status:'expired'},{headers:noCache});
    const pair=JSON.parse(raw);
    if(pair.status!=='ready')return NextResponse.json({status:'pending'},{headers:noCache});
    const sealed=await redis('GETDEL',resultKey(device_code));
    if(!sealed)return NextResponse.json({status:'expired'},{headers:noCache});
    await redis('DEL',deviceKey(device_code));
    return NextResponse.json({status:'authorized',envelope:JSON.parse(sealed)},{headers:noCache});
  }catch{return NextResponse.json({error:'No fue posible consultar la vinculación.'},{status:503,headers:noCache});}
}
