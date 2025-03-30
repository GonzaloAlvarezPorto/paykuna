import fs from "fs";
import path from "path";

// Ruta al archivo JSON
const filePath = path.join(process.cwd(), "public", "data", "productos.json");

// Leer productos
const leerProductos = () => {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

// Escribir productos
const escribirProductos = (productos) => {
  fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));
};

// ✅ Método GET: Obtener productos
export async function GET() {
  const productos = leerProductos();
  return Response.json(productos);
}

// ✅ Método POST: Agregar producto
export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre, categoria, precio, imagen } = body;

    if (!nombre || !categoria || !precio || !imagen) {
      return new Response(JSON.stringify({ error: "Todos los campos son obligatorios" }), { status: 400 });
    }

    let productos = leerProductos();
    const nuevoId = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
    const nuevoProducto = { id: nuevoId, nombre, categoria, precio, imagen };

    productos.push(nuevoProducto);
    escribirProductos(productos);

    return new Response(JSON.stringify(nuevoProducto), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error procesando la solicitud" }), { status: 500 });
  }
}
