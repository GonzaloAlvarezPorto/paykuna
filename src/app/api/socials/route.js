import { createSocial, getSocials } from "@/services/socials";

export async function GET() {

    try {
        const socials = await getSocials();
        return new Response(JSON.stringify(socials));

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
}

export async function POST(request) {
    try {

        const body = await request.json();

        const newSocial = await createSocial(body);

        return new Response(JSON.stringify(newSocial), {
            headers: { "Content-Type": "application/json" },
            status: 201,
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    }
}

