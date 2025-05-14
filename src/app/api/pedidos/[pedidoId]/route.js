import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "public", "data", "pedidos.json");

// Leer pedidos
const leerPedidos = () => {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
};

// ✅ GET: Obtener un pedido por ID
export async function GET(request, { params }) {
    // Esperar a que params esté disponible
    const { pedidoId } = params;

    if (!pedidoId) {
        return new Response(JSON.stringify({ error: "ID de pedido no proporcionado" }), { status: 400 });
    }

    // Leer los pedidos desde el archivo
    const pedidos = leerPedidos();

    // Buscar el pedido por ID
    const pedido = pedidos.find(p => p.id === parseInt(pedidoId));

    if (!pedido) {
        return new Response(JSON.stringify({ error: "Pedido no encontrado" }), { status: 404 });
    }

    // Devolver el pedido encontrado
    return new Response(JSON.stringify(pedido), { status: 200 });
}
