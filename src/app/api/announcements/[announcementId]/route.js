import { deleteAnnouncement, getAnnouncementById, updateAnnouncement } from "@/services/announcements";

export async function GET(req, { params }) {
    try {

        const { announcementId } = await params;

        const announcement = await getAnnouncementById(announcementId);
        return new Response(JSON.stringify(announcement), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { announcementId } = await params;
        const data = await req.json();

        const updatedAnnouncement = await updateAnnouncement(announcementId, data);
        return new Response(JSON.stringify(updatedAnnouncement), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { announcementId } = await params;
        await deleteAnnouncement(announcementId);
        return new Response(JSON.stringify({ success: true, id: announcementId }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}