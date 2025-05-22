import { NextResponse } from "next/server";
import nosotros from '../../../../public/data/nosotros.json'


export async function GET() {
    return NextResponse.json(nosotros);
}