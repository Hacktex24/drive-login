export default function Home(){
 return <main style={{maxWidth:850,margin:'8vh auto',padding:'0 20px',fontFamily:'Segoe UI,Arial,sans-serif',color:'#12364c'}}>
  <header style={{borderRadius:24,padding:'40px 38px',background:'linear-gradient(120deg,#12314d,#086a82,#089e9d)',color:'white',boxShadow:'0 16px 45px #12364c18'}}>
   <div style={{fontWeight:800,letterSpacing:2,fontSize:18}}>MOSMEX <span style={{fontSize:13,opacity:.85}}>TOOLCONTROL</span></div>
   <h1 style={{fontSize:37,lineHeight:1.1,margin:'30px 0 12px'}}>Google Drive sin configuraciones complicadas.</h1>
   <p style={{lineHeight:1.65,maxWidth:620}}>Vincula tu PC con un PIN temporal. Tu inventario y las Bitácoras continúan trabajando localmente, incluso si no hay internet.</p>
   <a href="/vincular" style={{display:'inline-block',background:'white',padding:'15px 25px',borderRadius:12,color:'#086880',fontWeight:800,textDecoration:'none',marginTop:18}}>Introducir mi PIN</a>
  </header>
  <section style={{background:'white',border:'1px solid #d8e7ee',borderRadius:18,padding:'26px 32px',marginTop:18}}>
   <h2 style={{marginTop:0}}>¿Cómo funciona?</h2>
   <ol style={{lineHeight:2,color:'#455f6e'}}>
    <li>Desde ToolControl Windows selecciona <strong>Vincular Google Drive (PIN)</strong>.</li>
    <li>Entra desde el celular a esta página, escribe el PIN y autoriza Google.</li>
    <li>La PC detecta la conexión y crea automáticamente la carpeta de respaldo.</li>
   </ol>
   <p style={{fontSize:13,color:'#647d88'}}>No guardamos tus contraseñas, inventarios ni certificados en este portal. Las credenciales de Google se envían cifradas a tu computadora.</p>
  </section>
  <footer style={{textAlign:'center',fontSize:12,margin:'22px 0',color:'#67828e'}}><a href="/privacy">Privacidad</a> · <a href="/terms">Condiciones</a></footer>
 </main>;
}
