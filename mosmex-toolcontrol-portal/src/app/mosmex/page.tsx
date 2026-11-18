type Query = {auth?: string};
export default async function AuthorizePage({searchParams}: {searchParams: Promise<Query>}) {
  const {auth}=await searchParams;
  let href: string | null = null;
  try {
    if (!auth || auth.length>5000) throw new Error('missing');
    const url = new URL(auth);
    const callback = url.searchParams.get('redirect_uri') || '';
    if (url.protocol !== 'https:' || url.hostname !== 'accounts.google.com' ||
        url.pathname !== '/o/oauth2/v2/auth' ||
        url.searchParams.get('response_type') !== 'code' ||
        !/^http:\/\/127\.0\.0\.1:\d{2,5}\/callback$/.test(callback) ||
        url.searchParams.get('code_challenge_method') !== 'S256') throw new Error('invalid');
    href=url.toString();
  } catch {href=null;}
  return <main style={{maxWidth:690,margin:'10vh auto',background:'white',padding:34,borderRadius:16,boxShadow:'0 5px 30px #203f661a'}}>
    <div style={{fontWeight:700,fontSize:13,letterSpacing:2,color:'#265f9e'}}>MOSMEX · TOOLCONTROL</div>
    <h1>Conectar Google Drive</h1>
    <p>La autorización se concede directamente a la aplicación de escritorio usando OAuth PKCE. Este portal no almacena contraseñas ni tokens y solo participa en la vinculación inicial.</p>
    {href ? <a href={href} rel="noreferrer" style={{display:'inline-block',background:'#2868c8',color:'white',padding:'13px 20px',textDecoration:'none',borderRadius:8}}>Continuar con Google</a>
     : <p style={{color:'#b42318'}}>Solicitud inválida. Inicia la vinculación desde ToolControl.</p>}
    <p style={{fontSize:13,color:'#687a90',marginTop:30}}>Después de autorizar, regresa a ToolControl. La sincronización posterior opera directamente con Google Drive; Bitácora permanece en la LAN.</p>
  </main>;
}