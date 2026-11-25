import type { Metadata } from 'next';
export const metadata: Metadata = {title:'MOSMEX ToolControl — Vinculación Google', description:'Launcher OAuth para ToolControl; sin inventarios ni credenciales'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="es"><body style={{margin:0,background:'#edf5f7',fontFamily:'Segoe UI,Arial,sans-serif',color:'#103b52'}}>{children}</body></html>}
