export const metadata={title:'Privacidad — MOSMEX ToolControl'};
export default function Privacy(){return <main style={{maxWidth:760,margin:'8vh auto',padding:28,fontFamily:'Arial,sans-serif',color:'#16374a',lineHeight:1.7,background:'white',borderRadius:16}}>
 <h1>Política de privacidad · MOSMEX ToolControl</h1>
 <p>Este portal se utiliza para vincular Google Drive con la aplicación de escritorio MOSMEX ToolControl. No está destinado al público en general ni para almacenar inventarios empresariales.</p>
 <h2>Datos que procesamos</h2>
 <p>Durante el emparejamiento procesamos un PIN temporal, una clave pública generada por la PC y el resultado de la autorización OAuth de Google. Un sobre cifrado de credenciales se mantiene temporalmente en almacenamiento privado de Vercel hasta que la computadora lo recoge. La PC protege su autorización en una bóveda local cifrada.</p>
 <h2>Acceso a Google Drive</h2>
 <p>La aplicación solicita el permiso drive.file para crear y administrar exclusivamente archivos que crea o que el usuario autoriza para ella. Las copias de inventario se cifran en la computadora y se transfieren directamente a Google Drive, no a este portal.</p>
 <h2>Conservación</h2>
 <p>El PIN expira a los 10 minutos. Los datos de emparejamiento se eliminan al confirmar la vinculación y, en todos los casos, expiran automáticamente del almacenamiento privado. Los tokens de renovación permanecen en la bóveda local mientras el usuario mantenga su autorización. Para revocar el permiso, utiliza la página de seguridad de tu cuenta Google.</p>
 <h2>Seguridad</h2><p>Se utiliza HTTPS, OAuth 2.0, PKCE y cifrado para la computadora destinataria. Las contraseñas MOSMEX nunca deben introducirse en el portal.</p>
 <p><a href="/">Volver al portal</a></p></main>}
