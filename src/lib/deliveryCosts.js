import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"
import { db } from "./firebase";

const deliveryCostsRef = collection(db, "deliveryCosts")

//Función que busca todos los costos
export async function getCosts() {
    const snapshot = await getDocs(deliveryCostsRef);
    const costs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return costs;
}

//Función que crea un costo
export async function createCost(localidad, precio) {
    try {
        // Validar tipos básicos
        if (typeof localidad !== "string") throw new Error("localidad debe ser string");
        if (typeof precio !== "number") throw new Error("precio debe ser número");

        // Crear documento con addDoc (genera id automáticamente)
        const docRef = await addDoc(deliveryCostsRef, { localidad, precio });

        // Retornar el id generado y los datos
        return { id: docRef.id, localidad, precio };
    } catch (error) {
        console.error("Error creando costo:", error);
        throw error;
    }
}


//Función que actualiza un costo
export async function updateCost(id, data) {
    try {
        const docRef = doc(db, "deliveryCosts", id);

        // Validar campos si querés más seguridad
        if (data.localidad && typeof data.localidad !== "string") {
            throw new Error("localidad debe ser string");
        }
        if (data.precio && typeof data.precio !== "number") {
            throw new Error("precio debe ser número");
        }

        await updateDoc(docRef, data);
        return { id, ...data };
    } catch (error) {
        console.error("Error actualizando costo:", error);
        throw error;
    }
}

//Función que busca un costo por Id
export async function getCostById(id) {
    try {
        const docRef = doc(db, "deliveryCosts", id);
        const docSnap = await getDoc(docRef);

        if(!docSnap.exists()){
            throw new Error("Costo no encontrado");
        }

        return {id: docSnap.id, ...docSnap.data()}
        
    } catch (error) {
        console.error("Error obteniendo costo por ID:", error);
        throw error;
    }

}
//Función que elimina un costo
export async function deleteCost(id) {
    try {
        const docRef = doc(db, "deliveryCosts", id);
        await deleteDoc(docRef);
        return { success: true, id };
    } catch (error) {
        console.error("Error eliminando costo:", error);
        throw error;
    }
}