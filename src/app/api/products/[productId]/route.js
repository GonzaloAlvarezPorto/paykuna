import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "public", "data", "productos.json");

// Leer productos
const leerProductos = () => {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
};

// ✅ GET: Obtener un producto por ID
export async function GET(request, { params }) {
    // Esperar a que params esté disponible
    const { productId } = await params; // El parámetro dinámico [productId]

    if (!productId) {
        return new Response(JSON.stringify({ error: "ID de producto no proporcionado" }), { status: 400 });
    }

    // Leer los productos desde el archivo
    const productos = leerProductos();

    // Buscar el producto por ID
    const producto = productos.find(p => p.id === parseInt(productId));

    if (!producto) {
        return new Response(JSON.stringify({ error: "Producto no encontrado" }), { status: 404 });
    }

    // Devolver el producto encontrado
    return new Response(JSON.stringify(producto), { status: 200 });
}
