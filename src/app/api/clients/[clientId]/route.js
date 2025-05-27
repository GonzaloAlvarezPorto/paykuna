import { deleteClient, getClientById, updateClient } from "@/services/clients";

export async function GET(req, { params }) {
    try {

        const { clientId } = await params;

        const client = await getClientById(clientId);
        return new Response(JSON.stringify(client), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { clientId } = await params;
        const data = await req.json();

        const updatedClient = await updateClient(clientId, data);
        return new Response(JSON.stringify(updatedClient), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { clientId } = await params;
        await deleteClient(clientId);
        return new Response(JSON.stringify({ success: true, id: clientId }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}