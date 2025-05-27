import { createAnnouncement, getAnnouncements } from "@/services/announcements";

export async function GET() {

    try {
        const announcements = await getAnnouncements();
        return new Response(JSON.stringify(announcements));
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        const newAnnouncement = await createAnnouncement(body);

        return new Response(JSON.stringify(newAnnouncement), {
            headers: { "Content-Type": "application/json" },
            status: 201,
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    }

}