import { deleteCost, getCostById, updateCost } from "@/lib/deliveryCosts";

export async function GET(request, { params }) {
    try {

        const { deliveryCostId } = await params;
        const costById = await getCostById(deliveryCostId);
        return new Response(JSON.stringify(costById), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { deliveryCostId } = await params;
        const data = await request.json();

        // Opcional: validar data.localidad y data.precio acá también si querés

        const updatedCost = await updateCost(deliveryCostId, data);
        return new Response(JSON.stringify(updatedCost), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { deliveryCostId } = await params;
        await deleteCost(deliveryCostId);
        return new Response(JSON.stringify({ success: true, id: deliveryCostId }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}