import { deleteAboutUs, getAboutUsById, updateAboutUs } from "@/services/aboutus";

export async function GET(req, { params }) {
    try {

        const { aboutUsId } = await params;

        const aboutUs = await getAboutUsById(aboutUsId);
        return new Response(JSON.stringify(aboutUs), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { aboutUsId } = await params;
        const data = await req.json();

        const updatedAboutUs = await updateAboutUs(aboutUsId, data);
        return new Response(JSON.stringify(updatedAboutUs), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { aboutUsId } = await params;
        await deleteAboutUs(aboutUsId);
        return new Response(JSON.stringify({ success: true, id: aboutUsId }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}