export const metadata={title:'MOSMEX · Vincular Google Drive'};
export default function Activate(){
 return <main style={{maxWidth:520,margin:'8vh auto',padding:'28px',fontFamily:'Segoe UI,Arial,sans-serif',color:'#11394a'}}>
  <header style={{background:'linear-gradient(120deg,#063f55,#0a9ca6)',color:'white',padding:28,borderRadius:16}}>
   <strong style={{letterSpacing:2}}>MOSMEX / TOOLCONTROL</strong><h1 style={{fontSize:28}}>Vincular Google Drive</h1>
   <p>Introduce el código temporal que aparece en tu PC. Después podrás autorizar tu cuenta Google.</p>
  </header>
  <form method="POST" action="/api/pair/authorize" style={{background:'white',border:'1px solid #cfdee6',marginTop:18,padding:28,borderRadius:16}}>
   <label htmlFor="pin" style={{display:'block',marginBottom:10,fontWeight:650}}>Código de vinculación</label>
   <input name="pin" id="pin" required minLength={8} maxLength={9} autoComplete="one-time-code"
    placeholder="ABCD-EFGH" pattern="[A-Za-z2-9-]{8,9}" style={{boxSizing:'border-box',width:'100%',padding:'14px 18px',fontSize:26,letterSpacing:4,textAlign:'center',border:'1px solid #a8bac5',borderRadius:10}}/>
   <button type="submit" style={{background:'#078da2',border:'none',color:'white',fontWeight:750,padding:16,borderRadius:10,width:'100%',marginTop:18,fontSize:16,cursor:'pointer'}}>Continuar con Google</button>
   <p style={{lineHeight:1.6,color:'#607787',fontSize:13}}>El PIN vence en 10 minutos. No necesitas ingresar credenciales MOSMEX aquí. La autorización se entrega cifrada exclusivamente a la PC que generó el código.</p>
  </form>
  <footer style={{fontSize:12,textAlign:'center',color:'#647e8d',marginTop:18}}>Soporte MOSMEX · Respaldo en Google Drive</footer>
 </main>;
}
