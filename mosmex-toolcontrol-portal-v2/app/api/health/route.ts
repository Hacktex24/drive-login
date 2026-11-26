import { NextResponse } from 'next/server';
import {configured,noCache} from '../../../lib/pin-core';
export const runtime='nodejs';export const dynamic='force-dynamic';
export function GET(){return NextResponse.json({service:'mosmex-toolcontrol-pin',version:'0.14.55',status:configured()?'ready':'setup_required',storesPlainTokens:false},{headers:noCache});}
