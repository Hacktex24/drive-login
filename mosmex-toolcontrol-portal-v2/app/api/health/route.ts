import { NextResponse } from 'next/server';
export function GET() {return NextResponse.json({service:'mosmex-toolcontrol-oauth',version:'0.14.54',status:'ready',storesTokens:false},{headers:{'Cache-Control':'no-store'}})}
