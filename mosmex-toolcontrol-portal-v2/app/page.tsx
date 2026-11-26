export default function Home(){return <main style={{maxWidth:850,margin:'7vh auto',padding:'0 22px',fontFamily:'Segoe UI,Arial,sans-serif',color:'#17384a'}}>
<header style={{background:'linear-gradient(125deg,#093b57,#087b97,#15a0a4)',color:'#fff',borderRadius:22,padding:'38px 42px'}}>
<div style={{letterSpacing:2,fontWeight:800,fontSize:20}}>MOSMEX <span style={{fontSize:13,opacity:.8}}> / TOOLCONTROL</span></div>
<p style={{fontSize:12,letterSpacing:1.4,marginTop:26}}>GOOGLE DRIVE · VINCULACIÓN SEGURA</p>
<h1 style={{fontSize:42,lineHeight:1.1}}>Tus respaldos en Drive. Un solo PIN.</h1>
<p style={{lineHeight:1.7}}>Abre ToolControl en tu PC, genera el PIN y autoriza Google desde tu celular. No necesitas configurar claves, enlaces ni carpetas.</p>
<a href="/activate" style={{display:'inline-block',marginTop:8,padding:'14px 24px',background:'white',color:'#075f77',fontWeight:800,borderRadius:9,textDecoration:'none'}}>Introducir mi PIN</a></header>
<section style={{marginTop:20,padding:30,background:'white',border:'1px solid #d8e6ed',borderRadius:18}}>
<h2>¿Cómo funciona?</h2><ol style={{lineHeight:2.15,color:'#405567'}}>
<li>En ToolControl, entra a Configuración → Google Drive y pulsa Conectar con PIN.</li>
<li>Ingresa el código temporal en esta página desde tu celular.</li>
<li>Accede a Google y autoriza la creación y gestión de respaldos.</li>
<li>La PC terminará de vincularse y creará la carpeta automáticamente.</li>
</ol><p style={{padding:15,background:'#eef8f8',borderRadius:9}}>El inventario local y la Bitácora OEE funcionan sin Internet. Los respaldos se cifran antes de salir de tu computadora.</p></section>
<footer style={{textAlign:'center',padding:'28px 0',fontSize:13}}><a href="/privacy">Privacidad</a> · <a href="/terms">Condiciones</a> · MOSMEX ToolControl PIN v0.14.55</footer></main>}