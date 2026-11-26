import { get, put, del } from '@vercel/blob';
import { randomBytes, createHash, createHmac, timingSafeEqual, createPublicKey, generateKeyPairSync, diffieHellman, hkdfSync, createCipheriv } from 'node:crypto';

export const PORTAL = 'https://mosmex-toolcontrol-oauth-brian-56ae.vercel.app';
export const CALLBACK = PORTAL + '/api/oauth/callback';
export const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
export const PAIR_TTL_MS = 10 * 60 * 1000;
const ROOT = 'mosmex-pin-v1/';
const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const AUTH_INFO = 'MOSMEX-OAUTH-PAIR-V1';
const AAD_INFO = 'MOSMEX-PAIR-GRANT-V1:';

export type Device = { id: string, pollHash: string, codeHash: string, publicKey: string, expires: number };
export type State = { deviceId: string, verifier: string, expires: number };

export function webConfigValid(): boolean {
  return /^[0-9]+-[A-Za-z0-9_-]+\.apps\.googleusercontent\.com$/.test(process.env.MOSMEX_GOOGLE_WEB_CLIENT_ID || '') &&
    Boolean(process.env.MOSMEX_GOOGLE_WEB_CLIENT_SECRET);
}
export function backendReady(): boolean {
  return webConfigValid() && Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}
export function errorJSON(message: string, status=400) {
  return Response.json({error:message}, {status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
export function digest(s:string) {return createHash('sha256').update(s,'utf8').digest('hex');}
export function safeEqualHex(a:string,b:string) {
  if(!/^[a-f0-9]{64}$/.test(a)||!/^[a-f0-9]{64}$/.test(b))return false;
  return timingSafeEqual(Buffer.from(a,'hex'),Buffer.from(b,'hex'));
}
function path(kind:string,id:string) {return ROOT + kind + '/' + id + '.json';}
export const devicePath=(id:string)=>path('device',id);
export const codePath=(hash:string)=>path('code',hash);
export const statePath=(id:string)=>path('state',id);
export const grantPath=(id:string)=>path('grant',id);
export async function saveJSON(name:string,data:unknown) {
  return put(name,JSON.stringify(data),{access:'private',allowOverwrite:false,addRandomSuffix:false,
    ttlDays:1,contentType:'application/json',cacheControlMaxAge:60});
}
export async function readJSON<T>(name:string):Promise<T|null> {
  const result=await get(name,{access:'private',useCache:false});
  if(!result||result.statusCode!==200)return null;
  const raw=await new Response(result.stream).text();
  if(raw.length>25000)throw new Error('Objeto remoto demasiado grande');
  return JSON.parse(raw) as T;
}
export async function removePaths(names:string[]) {
  try{await del(names)}catch{/* Expiry still enforced, and Blob TTL cleans up. */}
}
export function normalizePIN(s:string) {
  const v=String(s||'').toUpperCase().replace(/[\s-]/g,'');
  return /^[A-HJ-NP-Z2-9]{12}$/.test(v)?v:'';
}
export function makePIN() {
  return Array.from(randomBytes(12),v=>CHARSET[v % CHARSET.length]).join('');
}
export function formatPIN(s:string){return s.slice(0,4)+'-'+s.slice(4,8)+'-'+s.slice(8,12);}
export function validId(id:string){return /^[a-f0-9]{32}$/.test(id);}
export async function readDevice(id:string):Promise<Device|null>{
  if(!validId(id))return null;
  const obj=await readJSON<Device>(devicePath(id));
  if(!obj||obj.id!==id||!Number.isSafeInteger(obj.expires)||obj.expires<Date.now())return null;
  return obj;
}
export function validatePublicKey(derB64:string){
  if(!/^[A-Za-z0-9+/=]{45,300}$/.test(derB64))throw new Error('Llave pública no válida');
  const key=createPublicKey({key:Buffer.from(derB64,'base64'),format:'der',type:'spki'});
  if(key.asymmetricKeyType!=='x25519')throw new Error('La llave debe ser X25519');
  return key;
}
export async function createDevice(publicKey:string){
  validatePublicKey(publicKey);
  const id=randomBytes(16).toString('hex');
  const pollingSecret=randomBytes(32).toString('base64url');
  const pin=makePIN();
  const hash=digest(pin);
  const expires=Date.now()+PAIR_TTL_MS;
  const device:Device={id,pollHash:digest(pollingSecret),codeHash:hash,publicKey,expires};
  await saveJSON(devicePath(id),device);
  await saveJSON(codePath(hash),{id,expires});
  return {code:formatPIN(pin),device_id:id,poll_secret:pollingSecret,expires_in:600,verification_uri:PORTAL+'/vincular'};
}
export async function authenticateDevice(body:any):Promise<Device|null>{
  const id=typeof body?.device_id==='string'?body.device_id:'';
  const secret=typeof body?.poll_secret==='string'?body.poll_secret:'';
  if(!validId(id)||!/^[A-Za-z0-9_-]{40,100}$/.test(secret))return null;
  const d=await readDevice(id);
  return d&&safeEqualHex(d.pollHash,digest(secret))?d:null;
}
export async function resolvePIN(pinInput:string):Promise<Device|null>{
  const pin=normalizePIN(pinInput);
  if(!pin)return null;
  const hash=digest(pin);
  const record=await readJSON<{id:string,expires:number}>(codePath(hash));
  if(!record||record.expires<Date.now())return null;
  const dev=await readDevice(record.id);
  return dev&&dev.codeHash===hash?dev:null;
}
export function googleAuthorizationURL(state:string,verifier:string){
  const challenge=createHash('sha256').update(verifier,'ascii').digest('base64url');
  const q=new URLSearchParams({
    client_id:process.env.MOSMEX_GOOGLE_WEB_CLIENT_ID||'',
    redirect_uri:CALLBACK,
    response_type:'code',
    state,code_challenge:challenge,code_challenge_method:'S256',
    scope:DRIVE_SCOPE,
    access_type:'offline',prompt:'consent'
  });
  return 'https://accounts.google.com/o/oauth2/v2/auth?'+q.toString();
}
export async function startWebOAuth(dev:Device){
  const state=randomBytes(32).toString('base64url');
  const verifier=randomBytes(48).toString('base64url');
  await saveJSON(statePath(state),{deviceId:dev.id,verifier,expires:dev.expires} satisfies State);
  return googleAuthorizationURL(state,verifier);
}
async function exchange(params:URLSearchParams){
  const response=await fetch('https://oauth2.googleapis.com/token',{
    method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:params.toString(),cache:'no-store',signal:AbortSignal.timeout(20000)
  });
  if(!response.ok)throw new Error('Google rechazó la solicitud OAuth ('+response.status+').');
  const token=await response.json();
  if(!token?.access_token||!token?.scope||!String(token.scope).split(' ').includes(DRIVE_SCOPE)){
    throw new Error('Google no autorizó Drive.file.');
  }
  return token;
}
export async function finishWebOAuth(code:string,state:string) {
  if(!/^[A-Za-z0-9_-]{32,128}$/.test(state)||!code||code.length>4096)throw new Error('Código OAuth no válido.');
  const key=statePath(state);
  const saved=await readJSON<State>(key);
  if(!saved||saved.expires<Date.now()||!validId(saved.deviceId))throw new Error('Vinculación vencida.');
  const dev=await readDevice(saved.deviceId);
  if(!dev)throw new Error('La PC ya no espera esta autorización.');
  // One-time state, best-effort deletion; the immutable grant prevents overwrite.
  await removePaths([key]);
  const params=new URLSearchParams({
    code,client_id:process.env.MOSMEX_GOOGLE_WEB_CLIENT_ID||'',
    client_secret:process.env.MOSMEX_GOOGLE_WEB_CLIENT_SECRET||'',
    redirect_uri:CALLBACK,grant_type:'authorization_code',code_verifier:saved.verifier
  });
  const token=await exchange(params);
  if(!token.refresh_token)throw new Error('Google no entregó acceso renovable. Reintenta el PIN.');
  const payload={
    access_token:token.access_token,refresh_token:token.refresh_token,
    expires_in:token.expires_in||3600,scope:token.scope,
    client_id:process.env.MOSMEX_GOOGLE_WEB_CLIENT_ID||'',
    refresh_ticket:signRefreshToken(token.refresh_token)
  };
  const envelope=sealForDevice(payload,dev);
  await saveJSON(grantPath(dev.id),envelope);
  return true;
}
export function sealForDevice(payload:unknown,dev:Device){
  const recipient=validatePublicKey(dev.publicKey);
  const ephem=generateKeyPairSync('x25519');
  const shared=diffieHellman({privateKey:ephem.privateKey,publicKey:recipient});
  const key=Buffer.from(hkdfSync('sha256',shared,Buffer.from(dev.id,'ascii'),Buffer.from(AUTH_INFO,'ascii'),32));
  const iv=randomBytes(12);
  const cipher=createCipheriv('aes-256-gcm',key,iv);
  cipher.setAAD(Buffer.from(AAD_INFO+dev.id,'ascii'));
  const ciphertext=Buffer.concat([cipher.update(Buffer.from(JSON.stringify(payload),'utf8')),cipher.final()]);
  return {version:1,ephemeral_key:ephem.publicKey.export({type:'spki',format:'der'}).toString('base64'),
    nonce:iv.toString('base64'),ciphertext:ciphertext.toString('base64'),tag:cipher.getAuthTag().toString('base64')};
}
export function signRefreshToken(refreshToken:string){
  return createHmac('sha256',process.env.MOSMEX_GOOGLE_WEB_CLIENT_SECRET||'')
    .update('MOSMEX-REFRESH-V1:').update(refreshToken).digest('base64url');
}
export function verifyRefreshTicket(refreshToken:string,ticket:string){
  const expected=signRefreshToken(refreshToken);
  if(!/^[A-Za-z0-9_-]{43}$/.test(ticket))return false;
  return timingSafeEqual(Buffer.from(expected,'ascii'),Buffer.from(ticket,'ascii'));
}
export async function renewAccess(refreshToken:string,ticket:string){
  if(!webConfigValid()||!refreshToken||refreshToken.length>5000||!verifyRefreshTicket(refreshToken,ticket))
    throw new Error('Renovación no autorizada.');
  const params=new URLSearchParams({client_id:process.env.MOSMEX_GOOGLE_WEB_CLIENT_ID||'',
    client_secret:process.env.MOSMEX_GOOGLE_WEB_CLIENT_SECRET||'',
    refresh_token:refreshToken,grant_type:'refresh_token'});
  const response=await fetch('https://oauth2.googleapis.com/token',{
    method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:params.toString(),cache:'no-store',signal:AbortSignal.timeout(20000)
  });
  if(!response.ok)throw new Error('Google solicita vincular la cuenta nuevamente.');
  const obj=await response.json();
  if(!obj.access_token)throw new Error('Google no renovó el acceso.');
  const updatedRefresh=obj.refresh_token||refreshToken;
  return {access_token:obj.access_token,expires_in:obj.expires_in||3600,
          refresh_token:updatedRefresh,refresh_ticket:signRefreshToken(updatedRefresh)};
}
export async function readGrant(id:string) {
  if(!validId(id))return null;
  return readJSON<any>(grantPath(id));
}
export async function ackDevice(dev:Device){
  await removePaths([devicePath(dev.id),codePath(dev.codeHash),grantPath(dev.id)]);
}
