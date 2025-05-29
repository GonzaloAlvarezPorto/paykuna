import { db } from "@/lib/firebase";
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, limit } from "firebase/firestore";

const aboutUsRef = collection(db, "aboutus");

export async function getAboutUs() {
    const q = query(aboutUsRef, orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    const aboutUs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return aboutUs;
}

export async function getAboutUsById(aboutUsId) {
    if (!aboutUsId) throw new Error("No se recibió aboutUsId");

    const aboutUsDocRef = doc(db, "aboutus", aboutUsId);
    const snapshot = await getDoc(aboutUsDocRef);

    if (!snapshot.exists()) throw new Error("Párrafo no encontrado");

    const aboutUs = { id: snapshot.id, ...snapshot.data() };
    return aboutUs;
}

export async function createAboutUs(data) {
    if (!data || typeof data !== "object") {
        throw new Error("Datos inválidos");
    }

    // Traer el párrafo con el mayor order actual
    const q = query(aboutUsRef, orderBy("order", "desc"), limit(1));
    const querySnapshot = await getDocs(q);

    let maxOrder = 0;
    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        if (docData.order && typeof docData.order === "number") {
            maxOrder = docData.order;
        }
    });

    const newAboutUs = {
        ...data,
        order: maxOrder + 1,
    };

    const docRef = await addDoc(aboutUsRef, newAboutUs);
    const aboutUsCreado = { id: docRef.id, ...newAboutUs };
    return aboutUsCreado;
}

export async function updateAboutUs(aboutUsId, data) {
    if (!aboutUsId || !data || typeof data !== "object") {
        throw new Error("ID y datos válidos requeridos");
    }

    const aboutUsDocRef = doc(db, "aboutus", aboutUsId);
    const snap = await getDoc(aboutUsDocRef);

    if (!snap.exists()) throw new Error("Párrafo no encontrado");

    await updateDoc(aboutUsDocRef, data);
    const aboutUsActualizado = { id: aboutUsId, ...data };
    return aboutUsActualizado;
}

export async function deleteAboutUs(aboutUsId) {
    if (!aboutUsId) throw new Error("No se recibió aboutUsId");

    const aboutUsDocRef = doc(db, "aboutus", aboutUsId);
    const snap = await getDoc(aboutUsDocRef);

    if (!snap.exists()) throw new Error("Párrafo no encontrado");

    await deleteDoc(aboutUsDocRef);

    const resultado = { mensaje: "Párrafo eliminado correctamente", id: aboutUsId };
    return resultado;
}