import { NextResponse } from "next/server";
import novedades from '../../../../public/data/novedades.json'

export async function GET() {

    return NextResponse.json(novedades)

}