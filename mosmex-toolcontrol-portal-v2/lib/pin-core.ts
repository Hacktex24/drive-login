import { createHash, randomBytes, createPublicKey, generateKeyPairSync, diffieHellman, hkdfSync, createCipheriv } from 'node:crypto';
import type { NextRequest } from 'next/server';

export const TTL = 600;
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const b64url = (n=32) => randomBytes(n).toString('base64url');
export const digest = (text:string) => createHash('sha256').update(text).digest('hex');
export const codeKey = (code:string) => 'mosmex:pin:code:'+digest(code);
export const deviceKey = (device:string) => 'mosmex:pin:device:'+digest(device);
export const resultKey = (device:string) => 'mosmex:pin:result:'+digest(device);
export const oauthKey = (state:string) => 'mosmex:pin:oauth:'+digest(state);
export function pin():string { let out=''; for(let i=0;i<8;i++)out+=alphabet[randomBytes(1)[0]%alphabet.length];return out; }
export function normalizePin(x:string):string {return x.replace(/[\s-]/g,'').toUpperCase();}
export function validPin(x:string):boolean{return /^[A-HJ-NP-Z2-9]{8}$/.test(x);}
export function publicUrl():string{return (process.env.MOSMEX_PUBLIC_BASE_URL||'https://mosmex-toolcontrol-oauth-brian-56ae.vercel.app').replace(/\/+$/,'');}
export function configured():boolean{return !!(process.env.MOSMEX_GOOGLE_WEB_CLIENT_ID && process.env.MOSMEX_GOOGLE_WEB_CLIENT_SECRET && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);}
export type Pair = {device:string;code:string;publicKey:string;status:'pending'|'ready';created:number};
export async function redis(...args:(string|number)[]):Promise<any> {
  const url=process.env.UPSTASH_REDIS_REST_URL||'';
  const token=process.env.UPSTASH_REDIS_REST_TOKEN||'';
  if(!url.startsWith('https://')||!token)throw new Error('El almacenamiento temporal del servicio no está configurado.');
  const resp=await fetch(url,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},
    body:JSON.stringify(args.map(String)),cache:'no-store'});
  if(!resp.ok)throw new Error('El almacenamiento temporal no está disponible.');
  const result=await resp.json();
  if(result.error)throw new Error('El almacenamiento temporal rechazó la solicitud.');
  return result.result;
}
export async function throttle(req:NextRequest, action:string, maximum=20):Promise<void> {
  const ip=(req.headers.get('x-vercel-forwarded-for')||req.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim().slice(0,120);
  const key='mosmex:pin:ratelimit:'+action+':'+digest(ip);
  const total=Number(await redis('INCR',key));
  if(total===1)await redis('EXPIRE',key,600);
  if(total>maximum)throw new Error('Demasiados intentos. Inténtalo más tarde.');
}
const SPKI=Buffer.from('302a300506032b656e032100','hex');
export function validatePublicKey(encoded:string):void {
  if(!/^[A-Za-z0-9_-]{43}$/.test(encoded))throw new Error('Clave del dispositivo inválida.');
  const raw=Buffer.from(encoded,'base64url');if(raw.length!==32)throw new Error('Clave del dispositivo inválida.');
  createPublicKey({key:Buffer.concat([SPKI,raw]),format:'der',type:'spki'});
}
export function sealToDevice(device:string, publicKey:string, obj:unknown) {
  validatePublicKey(publicKey);
  const recipient=createPublicKey({key:Buffer.concat([SPKI,Buffer.from(publicKey,'base64url')]),format:'der',type:'spki'});
  const ephemeral=generateKeyPairSync('x25519');
  const shared=diffieHellman({privateKey:ephemeral.privateKey,publicKey:recipient});
  const salt=Buffer.from(digest(device),'hex');
  const key=Buffer.from(hkdfSync('sha256',shared,salt,Buffer.from('MOSMEX_PIN_V1'),32));
  const iv=randomBytes(12);
  const aes=createCipheriv('aes-256-gcm',key,iv);aes.setAAD(salt);
  const ciphertext=Buffer.concat([aes.update(Buffer.from(JSON.stringify(obj),'utf8')),aes.final()]);
  return {version:1,ephemeral_public_key:(ephemeral.publicKey.export({format:'der',type:'spki'}) as Buffer).subarray(-32).toString('base64url'),
    nonce:iv.toString('base64url'),ciphertext:ciphertext.toString('base64url'),tag:aes.getAuthTag().toString('base64url')};
}
export const noCache={'Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'};
export async function smallJSON(req:NextRequest,limit=4096):Promise<any> {
  const raw=await req.text();if(raw.length>limit)throw new Error('Solicitud demasiado grande.');
  return JSON.parse(raw);
}
