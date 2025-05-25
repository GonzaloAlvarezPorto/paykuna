//Este endpoint debe llamar a las funciones de lib/deliveryCosts.js para ver todos los costos y para crear costos

import { createCost, getCosts } from "@/lib/deliveryCosts";

export async function GET() {
    try {
        const costs = await getCosts();
        return Response.json(costs);

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function POST(request) {
    try {
        //Parsear JSON del body cuando creamos el costo
        const body = await request.json();

        //obtenemos los campos desde el formulario (cuando se haga)
        const { localidad, precio } = body;

        //lamamos a la funcion que crea el costo
        const newCost = await createCost(localidad, precio);

        //devolvemos el resultado de ejecutar la funcion
        return new Response(JSON.stringify(newCost), {
            headers: { "Content-Type": "application/json" },
            status: 201,
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    }
}