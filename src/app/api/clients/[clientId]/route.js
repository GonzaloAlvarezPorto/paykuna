import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../@/lib/firebase";
import { deleteClient } from "@/lib/clients";

export async function GET(req, { params }) {
    const { clienteId } = await params;

    try {
        const ref = doc(db, "clientes", clienteId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
        }

        return NextResponse.json({ id: snap.id, ...snap.data() });
    } catch (error) {
        console.error("Error al obtener cliente:", error);
        return NextResponse.json({ error: "Error al obtener cliente" }, { status: 500 });
    }
}

export async function DELETE(req,{params}) {
    const { clientId } = await params;

    try{
        const resultado = await deleteClient(clientId);
        return NextResponse.json(resultado);
    }
    catch (error){
        console.error("Error al eliminar cliente:", error);
        return NextResponse.json({error: "Error al eliminar cliente" }, {status: 500})
    }
}