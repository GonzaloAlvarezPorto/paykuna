import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "public", "data", "productos.json");

// Leer productos (ahora async)
const leerProductoPorId = async () => {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
};

// ✅ GET: Obtener un producto por ID
export async function GET(request, { params }) {
  const { productId } = await params; // params no es promesa, llega directo

  if (!productId) {
    return new Response(JSON.stringify({ error: "ID de producto no proporcionado" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const productos = await leerProductoPorId();

  const producto = productos.find(p => p.id === parseInt(productId));

  if (!producto) {
    return new Response(JSON.stringify({ error: "Producto no encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(producto), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
