import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

const announcementsRef = collection(db, "announcements");

export async function getAnnouncements() {
    const snapshot = await getDocs(announcementsRef);

    const announcements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return announcements;
}

export async function getAnnouncementById(announcementId) {
    if (!announcementId) throw new Error("No se recibió announcementId")

    const announcementRef = doc(db, "announcements", announcementId);
    const snapshot = await getDoc(announcementRef);

    if (!snapshot.exists()) throw new Error("Novedad no encontrada");

    const announcements = { id: snapshot.id, ...snapshot.data() }
    return announcements;
}

export async function createAnnouncement(data) {

    if (!data || typeof data !== "object") {
        throw new Error("Datos inválidos");
    }

    const newAnnouncement = data;
    const docRef = await addDoc(announcementsRef, newAnnouncement);
    const announcementCreado = { id: docRef.id, ...newAnnouncement };
    return announcementCreado;
}

export async function updateAnnouncement(announcementId, data) {
    if (!announcementId || !data || typeof data !== "object") {
        throw new Error("ID y datos válidos requeridos");
    }

    const announcementDocRef = doc(db, "announcements", announcementId);
    const snap = await getDoc(announcementDocRef);

    if (!snap.exists()) throw new Error("Párrafo no encontrado");

    await updateDoc(announcementDocRef, data);
    const announcementActualizado = { id: announcementId, ...data };
    return announcementActualizado;
}

export async function deleteAnnouncement(announcementId) {
    if (!announcementId) throw new Error("No se recibió announcementId");

    const announcementDocRef = doc(db, "announcements", announcementId);
    const snap = await getDoc(announcementDocRef);

    if (!snap.exists()) throw new Error("Párrafo no encontrado");

    await deleteDoc(announcementDocRef);

    const resultado = { mensaje: "Párrafo eliminado correctamente", id: announcementId };
    return resultado;
}