import { NextResponse } from "next/server";
import costosEnvio from "../../../../public/data/costosEnvio.json";

export async function GET() {
    
    return NextResponse.json(costosEnvio);
}