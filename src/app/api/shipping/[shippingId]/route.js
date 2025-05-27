//OJOOO acá está todo modificadoooo

import { deleteShipping, getShippingById, updateShipping } from "@/services/shipping";

export async function GET(request, { params }) {
    try {

        const { shippingId } = await params;
        const shippingById = await getShippingById(shippingId);
        return new Response(JSON.stringify(shippingById), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { shippingId } = await params;
        const data = await request.json();

        // Opcional: validar data.localidad y data.precio acá también si querés

        const updatedShipping = await updateShipping(shippingId, data);
        return new Response(JSON.stringify(updatedShipping), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { shippingId } = await params;
        await deleteShipping(shippingId);
        return new Response(JSON.stringify({ success: true, id: shippingId }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}