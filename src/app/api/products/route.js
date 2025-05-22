import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "public", "data", "productos.json");

// Leer productos (async)
const leerTodosProductos = async () => {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
};

// Escribir productos (async)
const escribirProductos = async (productos) => {
  await fs.writeFile(filePath, JSON.stringify(productos, null, 2));
};

// ✅ Método GET: Obtener productos
export async function GET() {
  try {
    const productos = await leerTodosProductos();
    return new Response(JSON.stringify(productos), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error al obtener productos" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ✅ Método POST: Agregar producto
export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre, categoria, precio, imagen } = body;

    if (!nombre || !categoria || !precio || !imagen) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son obligatorios" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const productos = await leerTodosProductos();
    const nuevoId = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
    const nuevoProducto = { id: nuevoId, nombre, categoria, precio, imagen };

    productos.push(nuevoProducto);
    await escribirProductos(productos);

    return new Response(JSON.stringify(nuevoProducto), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error procesando la solicitud" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
