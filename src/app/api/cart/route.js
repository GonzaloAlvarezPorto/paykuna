import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
    try {
        const { email, carrito } = await req.json();

        if (!email || !carrito) {
            return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), "public", "data", "pedidos.json");
        const existe = fs.existsSync(filePath);
        const data = existe ? fs.readFileSync(filePath, "utf-8") : "[]";
        const carritos = JSON.parse(data);

        // Buscar el mayor ID actual
        const ultimoId = carritos.reduce((max, pedido) => {
            return pedido.id > max ? pedido.id : max;
        }, 0);

        const nuevoCarrito = {
            id: ultimoId + 1,
            email,
            carrito,
            fecha: new Date().toISOString(),
        };

        carritos.push(nuevoCarrito);
        fs.writeFileSync(filePath, JSON.stringify(carritos, null, 2));

        return NextResponse.json({ mensaje: "Carrito guardado exitosamente", id: nuevoCarrito.id });
    } catch (error) {
        console.error("Error al guardar el carrito:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
