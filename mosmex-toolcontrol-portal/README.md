# MOSMEX ToolControl — portal Vercel aislado

Este proyecto está aislado de las rutas Kodi de drive-login. Para publicarlo en Vercel seleccione **Root Directory: mosmex-toolcontrol-portal** dentro de este repositorio.

## Función

Vercel es solo una página de inicio para la vinculación Google OAuth con PKCE; no almacena contraseñas, tokens, inventarios ni paquetes. ToolControl recibe el código en un servidor temporal 127.0.0.1 y consulta directamente la Google Drive API después de autorizar. Las LAN de Bitácora y el inventario SQLite no dependen del portal.

## Configuración

1. TI autoriza Google Drive API en Google Cloud.
2. Configurar pantalla de consentimiento OAuth y estado de publicación.
3. Crear credencial OAuth de tipo **Aplicación de escritorio** y copiar su client ID público.
4. Publicar esta carpeta como proyecto independiente en Vercel y obtener su dirección HTTPS.
5. En ToolControl → Usuarios y Drive ingresar client ID, URL Vercel e ID de la carpeta Drive compartida.
6. Vincular Google desde ToolControl.

No incluya claves privadas, archivos de inventario, JSON de usuarios reales ni credenciales en este repositorio. La conexión inicial de un dispositivo nuevo exige verificar el registro firmado de Root por canal confiable. Los conflictos de versiones de inventario no se resuelven mediante sobrescritura automática.

**Nota:** Se requiere configurar Google Cloud y el despliegue Vercel; tener este código en GitHub por sí solo no activa el servicio. El uso empresarial de Vercel debe respetar su contrato y las políticas TI.
