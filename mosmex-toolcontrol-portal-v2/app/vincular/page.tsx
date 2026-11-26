export const metadata={title:'Vincular Google Drive — MOSMEX ToolControl'};
export default function Vincular(){
 return <main style={{maxWidth:620,margin:'6vh auto',padding:'0 18px',fontFamily:'Segoe UI,Arial,sans-serif',color:'#10334c'}}>
  <header style={{background:'linear-gradient(125deg,#063d56,#079a9a)',borderRadius:'22px 22px 0 0',padding:'30px 36px',color:'white'}}>
   <div style={{fontSize:14,fontWeight:800,letterSpacing:2}}>MOSMEX / TOOLCONTROL</div>
   <h1 style={{fontSize:32,lineHeight:1.2,marginBottom:8}}>Vincular Google Drive</h1>
   <p style={{lineHeight:1.6,opacity:.9}}>Autoriza tu cuenta sin configurar claves en la computadora.</p>
  </header>
  <section style={{padding:'30px 36px',border:'1px solid #dae7ed',borderTop:'none',borderRadius:'0 0 22px 22px',background:'white'}}>
   <div style={{fontSize:12,letterSpacing:1.4,fontWeight:800,color:'#0b8192'}}>PASO 1 DE 2</div>
   <h2 style={{fontSize:22,margin:'10px 0'}}>Introduce el PIN de tu PC</h2>
   <p style={{color:'#4c6676',lineHeight:1.6}}>Abre ToolControl en Windows, pulsa <strong>Vincular Google Drive (PIN)</strong> e introduce aquí el código que se muestra. Vence a los 10 minutos.</p>
   <form action="/api/pair/authorize" method="POST">
    <label htmlFor="code" style={{display:'block',fontSize:13,fontWeight:700,marginBottom:9}}>Código de 12 caracteres</label>
    <input id="code" name="code" required maxLength={18} minLength={12} autoCapitalize="characters" autoComplete="off" spellCheck={false} placeholder="XXXX-XXXX-XXXX" aria-label="PIN de vinculación" style={{boxSizing:'border-box',width:'100%',padding:'19px 16px',border:'2px solid #b5ccd6',borderRadius:12,fontSize:23,fontWeight:800,letterSpacing:2,color:'#173e53',background:'#f9fcfd'}}/>
    <button type="submit" style={{marginTop:20,padding:'16px 22px',background:'#088b9e',color:'white',fontSize:16,fontWeight:800,width:'100%',border:0,borderRadius:12,cursor:'pointer'}}>Continuar con Google</button>
   </form>
   <p style={{fontSize:13,color:'#617887',marginTop:20,lineHeight:1.7}}>En el siguiente paso Google mostrará los permisos de Drive. Confirma únicamente si tú iniciaste la vinculación en tu computadora.</p>
   <p style={{fontSize:12,color:'#637b86'}}>No compartas el PIN en mensajes públicos ni introduzcas aquí contraseñas MOSMEX.</p>
  </section>
  <footer style={{fontSize:12,color:'#647b88',textAlign:'center',marginTop:20}}>
   <a href="/privacy" style={{color:'#087c9a'}}>Privacidad</a> · <a href="/terms" style={{color:'#087c9a'}}>Condiciones</a>
  </footer>
 </main>;
}
