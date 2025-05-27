import { createProduct, getProducts } from "@/services/products";

export async function GET() {
  try {
    const productos = await getProducts();
    return new Response(JSON.stringify(productos));

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// ✅ Método POST: Agregar producto
export async function POST(request) {
  try {
    const body = await request.json();

    const newProduct = await createProduct(body);

    return new Response(JSON.stringify(newProduct), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
