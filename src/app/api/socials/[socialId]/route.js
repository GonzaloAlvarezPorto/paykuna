import { deleteSocial, getSocialById, updateSocial } from "@/services/socials";

export async function GET(req, { params }) {
    try {
        const { socialId } = await params;

        const social = await getSocialById(socialId);

        return new Response(JSON.stringify(social), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { socialId } = await params;
        const data = await req.json();

        const updatedSocial = await updateSocial(socialId, data);
        return new Response(JSON.stringify(updatedSocial), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { socialId } = await params;
        await deleteSocial(socialId);
        return new Response(JSON.stringify({ success: true, id: socialId }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}