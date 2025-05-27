import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

const productsRef = collection(db, "products");

export async function getProducts() {
    const snapshot = await getDocs(productsRef);
    const products = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    return products;
}

export async function getProductById(productId) {
    if (!productId) throw new Error("No se recibió productId");
    
        const productDocRef = doc(db, "products", productId);
        const snapshot = await getDoc(productDocRef);
    
        if (!snapshot.exists()) throw new Error("Producto no encontrado");
    
        const product = { id: snapshot.id, ...snapshot.data() };
        return product;
}

export async function createProduct(data) {
    if (!data || typeof data !== "object") {
        throw new Error("Datos inválidos");
    }
    const newProduct = data;
    const docRef = await addDoc(productsRef, newProduct);
    const productCreado = {id: docRef.id, ...newProduct};
    return productCreado;
}

export async function updateProduct(productId,data) {
    if (!productId || !data || typeof data !== "object") {
            throw new Error("ID y datos válidos requeridos");
        }
    
        const productDocRef = doc(db, "products", productId);
        const snap = await getDoc(productDocRef);
    
        if (!snap.exists()) throw new Error("Producto no encontrado");
    
        await updateDoc(productDocRef, data);
        const productActualizado = { id: productId, ...data };
        return productActualizado;
}

export async function deleteProduct(productId) {
    if (!productId) throw new Error("No se recibió productId");
    
        const productDocRef = doc(db, "products", productId);
        const snap = await getDoc(productDocRef);
    
        if (!snap.exists()) throw new Error("Producto no encontrado");
    
        await deleteDoc(productDocRef);
    
        const resultado = { mensaje: "Producto eliminado correctamente", id: productId };
        return resultado;
}