import { NextResponse } from "next/server";
import { db } from "@/lib/firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { searchOrCreateClient } from "@/lib/clients.js"; // Firebase version

export async function GET() {
  try {
    const clientesCol = collection(db, "clientes");
    const snapshot = await getDocs(clientesCol);
    const clientes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(clientes);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return NextResponse.json({ error: "No se pudo obtener clientes" }, { status: 500 });
  }
}

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Falta el email" }, { status: 400 });
  }

  try {
    const id = await searchOrCreateClient(email);
    return NextResponse.json({ id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al procesar cliente" }, { status: 500 });
  }
}
