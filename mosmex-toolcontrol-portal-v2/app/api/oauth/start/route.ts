import { NextRequest, NextResponse } from 'next/server';
export const runtime='nodejs'; export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
 const params=req.nextUrl.searchParams;
 const clientId=process.env.MOSMEX_GOOGLE_DESKTOP_CLIENT_ID||'';
 if(!/^[0-9]+-[A-Za-z0-9_-]+\.apps\.googleusercontent\.com$/.test(clientId)) return NextResponse.json({error:'OAuth no configurado.'},{status:503});
 const state=params.get('state')||'', challenge=params.get('challenge')||'', redir=params.get('redirect_uri')||'';
 if(!/^[A-Za-z0-9_-]{32,128}$/.test(state)|| !/^[A-Za-z0-9_-]{43,128}$/.test(challenge)) return NextResponse.json({error:'Parámetros PKCE inválidos.'},{status:400});
 let uri:URL;try{uri=new URL(redir)}catch{return NextResponse.json({error:'Redirección inválida.'},{status:400})}
 if(uri.protocol!=='http:' || !['127.0.0.1','[::1]','localhost'].includes(uri.hostname) || !/^\/oauth\/callback\/?$/.test(uri.pathname) || uri.username || uri.password || uri.search || uri.hash || !uri.port) return NextResponse.json({error:'Solo se permite localhost.'},{status:400});
 const google=new URL('https://accounts.google.com/o/oauth2/v2/auth');
 for(const [k,v] of Object.entries({response_type:'code',client_id:clientId,redirect_uri:redir,scope:'https://www.googleapis.com/auth/drive.file',state,code_challenge:challenge,code_challenge_method:'S256',access_type:'offline',prompt:'consent'}))google.searchParams.set(k,v);
 const response=NextResponse.redirect(google.toString(),302);response.headers.set('Cache-Control','no-store');response.headers.set('Referrer-Policy','no-referrer');return response;
}
