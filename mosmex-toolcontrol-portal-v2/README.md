# MOSMEX ToolControl OAuth por PIN v0.14.55

Proyecto Next.js independiente en mosmex-toolcontrol-portal-v2, repositorio Hacktex24/drive-login. No modifica PlayDrive, Kodi ni StreamBox.

## Uso
1. ToolControl v0.14.55 muestra un PIN temporal XXXX-XXXX, con vigencia de 10 minutos.
2. El usuario ingresa el PIN en https://mosmex-toolcontrol-oauth-brian-56ae.vercel.app/activate desde el celular.
3. Google OAuth Web autoriza Drive.file; el portal entrega el resultado cifrado a la clave efímera de la PC mediante X25519 + HKDF-SHA256 + AES-256-GCM.
4. La PC guarda el token cifrado con la contraseña MOSMEX y crea automáticamente la carpeta de respaldo.
5. La aplicación usa Google Drive API directamente; las renovaciones de token pasan por Vercel, donde permanece el Client Secret OAuth Web.

## Configuración administrativa única
Crear un cliente OAuth de tipo Aplicación web en Google Cloud, proyecto mosmex-toolcontrol.
Redirección OAuth exacta: https://mosmex-toolcontrol-oauth-brian-56ae.vercel.app/api/pair/callback

En Vercel mosmex-toolcontrol-oauth deben añadirse las siguientes variables (no incluir secretos en GitHub ni chat):
- MOSMEX_GOOGLE_WEB_CLIENT_ID: ID del OAuth Web.
- MOSMEX_GOOGLE_WEB_CLIENT_SECRET: secreto del OAuth Web, tipo Sensitive.
- MOSMEX_PUBLIC_BASE_URL: https://mosmex-toolcontrol-oauth-brian-56ae.vercel.app
- UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN: base Redis dedicada a MOSMEX para PIN y estado temporal.

No reutilizar la base Redis de PlayDrive sin una revisión explícita. La API Key Gemini y el Client ID Desktop anterior no sustituyen al cliente OAuth Web.

Tras definir variables, redesplegar y abrir /api/health: status ready significa que existen todas las variables; no confirma todavía conexión a Google.

## Privacidad y seguridad
- PIN aleatorio y expiración de 10 minutos.
- El código secreto de dispositivo tiene 256 bits y el resultado es cifrado, de un solo uso.
- Redis almacena temporalmente estado y el mensaje de token cifrado; no persiste el refresh token sin cifrar.
- Durante la vinculación y renovación el servidor procesa tokens en memoria; la contraseña MOSMEX nunca se transmite al portal.
- Solo se solicita drive.file, para archivos creados/autorizados por la aplicación.
- El respaldo manual FULL de SQLite y PDF se cifra en la PC antes de subirse a Google Drive.
- El directorio de usuarios, revocaciones y los inventarios maestros multiplanta NO se sincronizan aún.

No dar por aprobadas las pruebas de usuario final hasta vincular una PC real, comprobar un respaldo cifrado y probar una restauración sobre datos de laboratorio.
