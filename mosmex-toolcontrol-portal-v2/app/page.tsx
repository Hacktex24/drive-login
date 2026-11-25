export default function Home() {
  return (
    <main style={{ maxWidth: 900, margin: '8vh auto', padding: '0 22px', color: '#153447', fontFamily: 'Segoe UI,Arial,sans-serif' }}>
      <header style={{ borderRadius: 22, padding: '38px 42px', color: 'white', background: 'linear-gradient(125deg,#15334f 0%,#086c84 60%,#149b96 100%)', boxShadow: '0 16px 50px #06304a22' }}>
        <div style={{ fontWeight: 800, letterSpacing: 2, fontSize: 22 }}>MOSMEX <span style={{ opacity: .8, fontSize: 14, letterSpacing: .4 }}>/ TOOLCONTROL</span></div>
        <p style={{ opacity: .8, marginTop: 22, fontSize: 13, fontWeight: 700, letterSpacing: 1.5 }}>VINCULACIÓN SEGURA · GOOGLE DRIVE</p>
        <h1 style={{ fontSize: 'clamp(28px,4.3vw,43px)', lineHeight: 1.15, margin: '6px 0 12px', letterSpacing: -.8 }}>Conecta tus respaldos sin detener la operación.</h1>
        <p style={{ maxWidth: 660, lineHeight: 1.7, opacity: .92 }}>Este portal inicia la autorización OAuth de Google para la aplicación de escritorio. La Bitácora OEE, las conexiones LAN y el inventario local continúan funcionando sin Vercel.</p>
      </header>
      <section style={{ border: '1px solid #d7e2ed', borderRadius: 20, background: 'white', padding: '30px 36px', marginTop: 22 }}>
        <h2 style={{ margin: 0, fontSize: 23 }}>¿Cómo vincular Google Drive?</h2>
        <ol style={{ lineHeight: 2.1, paddingLeft: 24, color: '#30495e' }}>
          <li>Abre <strong>ToolControl → Configuración → Google Drive</strong>.</li>
          <li>Guarda el Client ID de Google Cloud y la URL de este portal.</li>
          <li>Presiona <strong>Vincular cuenta Google</strong> y autoriza Drive en el navegador.</li>
          <li>Regresa a ToolControl, crea una carpeta y realiza tu primer respaldo cifrado.</li>
        </ol>
        <p style={{ borderLeft: '4px solid #149b96', padding: '12px 18px', background: '#eef9f8', borderRadius: 8, lineHeight: 1.7 }}>Para iniciar la vinculación debes hacerlo desde ToolControl. Nunca escribas aquí tu contraseña MOSMEX, tokens de Bitácora ni contraseñas de Google.</p>
      </section>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 14, marginTop: 16 }}>
        {[['LOCAL-FIRST','El inventario se guarda en la PC; Drive sirve para respaldos cifrados.'],
          ['SIN TOKENS EN VERCEL','Los códigos OAuth regresan a 127.0.0.1 en la computadora que autorizó.'],
          ['CONTROL POR CUENTA','Los respaldos requieren la contraseña de la cuenta MOSMEX que los creó.']].map(([title,body])=>(
          <article key={title} style={{ background: '#f9fcfe', padding: '22px 24px', border: '1px solid #dae7ee', borderRadius: 16 }}>
            <strong style={{ color: '#086c84', fontSize: 12, letterSpacing: 1.1 }}>{title}</strong>
            <p style={{ lineHeight: 1.6, color: '#40586a' }}>{body}</p>
          </article>
        ))}
      </section>
      <footer style={{ textAlign: 'center', color: '#61788b', padding: '26px 0', fontSize: 13 }}>MOSMEX ToolControl · Portal OAuth Desktop v0.14.54</footer>
    </main>
  );
}
