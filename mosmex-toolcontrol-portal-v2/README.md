# MOSMEX ToolControl — PIN OAuth v0.14.55

This is a **standalone Vercel project** within the Hacktex24/drive-login GitHub repository. The PlayDrive/Kodi production app is untouched.

## No technical settings on desktops
1. Open ToolControl v0.14.55 > Configuración > Google Drive > Vincular Google Drive (PIN).
2. ToolControl shows a temporary 12-character code (10-minute validity).
3. On a phone visit https://mosmex-toolcontrol-oauth-brian-56ae.vercel.app/vincular.
4. Enter PIN, grant Google Drive permissions, return to ToolControl.
5. Desktop automatically saves encrypted authorization in the MOSMEX user vault and creates the private backup folder.

## One-time administrator setup (not repeated by users)
- Google Cloud project: mosmex-toolcontrol (Google Drive API enabled).
- In Google Auth Platform create an OAuth **Web application** client. The previous Desktop client does not support the web callback.
- Set its Authorized redirect URI exactly:
  https://mosmex-toolcontrol-oauth-brian-56ae.vercel.app/api/oauth/callback
- In Vercel project mosmex-toolcontrol-oauth, set environment variables:
  MOSMEX_GOOGLE_WEB_CLIENT_ID (public Web client ID)
  MOSMEX_GOOGLE_WEB_CLIENT_SECRET (Google Web client secret; encrypted / sensitive)
- Private Vercel Blob store: mosmex-toolcontrol-pairing, linked to this Vercel project.
- Redeploy Vercel production after saving variables.
- Health endpoint: /api/health must return status "ready".
- While Google OAuth is in Testing mode, only configured test users can authorize and refresh tokens generally expire after 7 days.

## Security details
- PIN: 12 random base32 characters (~60 bits of entropy), expires after 10 minutes.
- Private Blob stores one-day-expiring session objects; PIN lookup uses a hash, not plaintext.
- 256-bit random polling secret; independent ephemeral X25519 recipient key on Windows.
- Backend exchanges the Google OAuth authorization code with PKCE and Web OAuth client credentials.
- Temporary access/refresh token grant is sealed to the PC with AES-256-GCM + ECDH/HKDF.
- Only encrypted grant is stored in Blob before pickup; after ACK, entries are deleted.
- Browser never gets the desktop polling secret or Google refresh tokens.
- The Web OAuth secret never leaves Vercel and is never packaged in the Windows application.
- Token renewal goes via the Vercel refresh endpoint using a server-HMAC refresh ticket.
- Inventories, certificates and MOSMEX passwords are never sent to Vercel; Drive backup archives are encrypted locally and uploaded directly to Google Drive.

## Operational limitations
This is a PILOT. It does not yet provide synchronized account directories across computers, continuous remote revocation, simultaneous inventory merges, or automated per-plant state conflict resolution. Live Google Web OAuth and Windows integration require verification before plant deployment.
