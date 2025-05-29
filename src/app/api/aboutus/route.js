import { createAboutUs, getAboutUs } from "@/services/aboutus";

export async function GET() {

    try {
        const aboutUs = await getAboutUs();
        return new Response(JSON.stringify(aboutUs));
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        const newAboutUs = await createAboutUs(body);

        return new Response(JSON.stringify(newAboutUs), {
            headers: { "Content-Type": "application/json" },
            status: 201,
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    }

}