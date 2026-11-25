# MOSMEX ToolControl OAuth Portal v0.14.54

A standalone Vercel project built from the **mosmex-toolcontrol-portal-v2** subfolder of the GitHub **Hacktex24/drive-login** repository.

## Purpose
- Starts Google Desktop OAuth2 Authorization Code + PKCE for ToolControl.
- Only accepts an ephemeral loopback callback on \`http://127.0.0.1:<port>/oauth/callback\`.
- Does NOT receive or store OAuth authorization codes, refresh tokens, MOSMEX passwords, SQLite databases or inventory files.
- ToolControl uploads encrypted/versioned full backups **directly** using the Google Drive API (\`drive.file\`).
- LAN/OEE syncing remains operational without this website.

## Deployment
1. Create a dedicated Vercel project \`mosmex-toolcontrol-oauth\` connected to the repository.
2. Set the project Root Directory to \`mosmex-toolcontrol-portal-v2\`.
3. Deploy the \`mosmex-toolcontrol-drive-v01454\` Git branch as a preview. Do NOT change the existing Kodi/PlayDrive production deployment.
4. No Vercel secret is necessary. The desktop app supplies its **public** Desktop OAuth Client ID to the portal. For single-client restriction you may set \`MOSMEX_GOOGLE_DESKTOP_CLIENT_ID\` to that public ID in Vercel.
5. In Google Cloud, enable Google Drive API and create OAuth 2.0 credentials of type **Desktop app**. Publish the consent screen appropriately. Users must be test users if the OAuth consent screen remains in Testing.
6. In ToolControl v0.14.54: Configuración > Google Drive. Paste Google Desktop OAuth Client ID and the Vercel HTTPS deployment URL. If Google Cloud supplies a desktop client secret, enter it in ToolControl (encrypted locally), **never in GitHub**.
7. Press Vincular cuenta Google, create the Drive folder, then perform a full encrypted backup.

## Not yet enabled
- Automatic multiplant inventory merge / authoritative master table.
- Automatic account directory propagation, vault onboarding on a brand-new PC, and immediate multi-PC revocation.
- Automatic restores. Restoring a remote FULL ZIP is an explicit, confirmation-gated desktop operation.

Never upload private keys, .env secrets, OAuth tokens, user vaults, certificates or plant inventory to GitHub. Production enterprise usage is subject to company IT approval and Vercel plan terms.
