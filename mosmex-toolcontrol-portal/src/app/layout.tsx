import type { Metadata } from 'next';
export const metadata: Metadata = {title: 'MOSMEX · Vinculación Google Drive',description: 'Portal de inicio de autorización para ToolControl'};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="es"><body style={{fontFamily:'Segoe UI,Arial,sans-serif',margin:0,background:'#eef3f9',color:'#193250'}}>{children}</body></html>;
}