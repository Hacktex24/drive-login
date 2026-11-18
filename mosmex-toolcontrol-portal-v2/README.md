# MOSMEX ToolControl — OAuth Desktop launcher aislado

Este subproyecto Next.js solo inicia Google OAuth con PKCE. No contiene ni almacena inventarios, contraseñas, códigos de autorización, refresh tokens ni claves privadas. El código vuelve directamente a un servidor temporal 127.0.0.1 de ToolControl.

## Configuración
1. Habilitar Google Drive API en Google Cloud y configurar un OAuth Client de tipo Desktop.
2. Definir MOSMEX_GOOGLE_DESKTOP_CLIENT_ID (ID público) en Vercel.
3. Desplegar **esta carpeta** como proyecto Vercel independiente (Root Directory: mosmex-toolcontrol-portal-v2). No modificar las rutas Kodi/PlayDrive.
4. Completar y probar en ToolControl el flujo loopback y el intercambio de PKCE, usando las credenciales cifradas por usuario.
5. Validar en Google Cloud el redirect loopback y el alcance drive.file para las carpetas compartidas de MOSMEX.

El portal NO realiza autenticación de roles MOSMEX y NO almacena datos operativos. No se ha desplegado ni verificado en Google Cloud/Vercel. Nunca introducir credenciales en el repositorio.
