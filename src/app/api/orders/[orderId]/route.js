import { deleteOrder, getOrderById, updateOrder } from "@/services/orders";

export async function GET(req, { params }) {
    try {

        const { orderId } = await params;

        const order = await getOrderById(orderId);
        return new Response(JSON.stringify(order), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { orderId } = await params;
        const data = await req.json();

        const updatedOrder = await updateOrder(orderId, data);
        return new Response(JSON.stringify(updatedOrder), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { orderId } = await params;
        await deleteOrder(orderId);
        return new Response(JSON.stringify({ success: true, id: orderId }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}