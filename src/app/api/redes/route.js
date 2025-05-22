import { NextResponse } from "next/server";
import redes from '../../../../public/data/redes.json'

export async function GET() {

    return NextResponse.json(redes)
    
}