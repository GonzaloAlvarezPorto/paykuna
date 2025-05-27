import { createOrder, getOrders } from "@/services/orders";

export async function GET() {

    try {
        const orders = await getOrders();
        return new Response(JSON.stringify(orders));
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        const newOrder = await createOrder(body);

        return new Response(JSON.stringify(newOrder), {
            headers: { "Content-Type": "application/json" },
            status: 201,
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    }

}