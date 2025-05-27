import { db } from "@/lib/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"

const shippingRef = collection(db, "shipping")

//Función que busca todos los costos
export async function getShippings() {
    const snapshot = await getDocs(shippingRef);
    const shipping = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return shipping;
}

//Función que busca un costo por Id
export async function getShippingById(shippingId) {
    if (!shippingId) throw new Error("No se recibió shippingId");

    const shippingDocRef = doc(db, "shipping", shippingId);
    const snapshot = await getDoc(shippingDocRef);

    if (!snapshot.exists()) throw new Error("Párrafo no encontrado");

    const shipping = { id: snapshot.id, ...snapshot.data() };
    return shipping;
}

export async function createShipping(data) {
    if (!data || typeof data !== "object") {
        throw new Error("Datos inválidos");
    }
    
    const newShipping = data;
    const docRef = await addDoc(shippingRef, newShipping);
    const shippingCreado = { id: docRef.id, ...newShipping };
    return shippingCreado;
}

export async function updateShipping(shippingId, data) {
    if (!shippingId || !data || typeof data !== "object") {
        throw new Error("ID y datos válidos requeridos");
    }

    const shippingDocRef = doc(db, "shipping", shippingId);
    const snap = await getDoc(shippingDocRef);

    if (!snap.exists()) throw new Error("Párrafo no encontrado");

    await updateDoc(shippingDocRef, data);
    const shippingActualizado = { id: shippingId, ...data };
    return shippingActualizado;
}

export async function deleteShipping(shippingId) {
    if (!shippingId) throw new Error("No se recibió shippingId");

    const shippingDocRef = doc(db, "shipping", shippingId);
    const snap = await getDoc(shippingDocRef);

    if (!snap.exists()) throw new Error("Párrafo no encontrado");

    await deleteDoc(shippingDocRef);

    const resultado = { mensaje: "Párrafo eliminado correctamente", id: shippingId };
    return resultado;
}