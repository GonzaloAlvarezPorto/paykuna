import { db } from "@/lib/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";

const ordersRef = collection(db, "orders");

// Buscador de todas las redes
export async function getOrders(){
    const snapshot = await getDocs(ordersRef);
    const orders = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    return orders;
}

export async function getOrderById(orderId) {
  if (!orderId) throw new Error("No se recibió orderId");

  const orderRef = doc(db, "orders", orderId);
  const snapshot = await getDoc(orderRef);

  if (!snapshot.exists()) throw new Error("Order no encontrada");

  const order = { id: snapshot.id, ...snapshot.data() };
  return order;
}

export async function createOrder(data) {
  if (!data || typeof data !== "object") {
        throw new Error("Datos inválidos");
    }
  const nuevoOrder = data;
  const docRef = await addDoc(ordersRef, nuevoOrder);
  const orderCreado = { id: docRef.id, ...nuevoOrder };
  return orderCreado;
}

export async function updateOrder(orderId, data) {
  if (!orderId || !data || typeof data !== "object") {
    throw new Error("ID y datos válidos requeridos");
  }

  const orderRef = doc(db, "orders", orderId);
  const snap = await getDoc(orderRef);

  if (!snap.exists()) throw new Error("Order no encontrado");

  await updateDoc(orderRef, data);
  const orderActualizado = { id: orderId, ...data };
  return orderActualizado;
}

export async function deleteOrder(orderId) {
  if (!orderId) throw new Error("No se recibió orderId");

  const orderRef = doc(db, "orders", orderId);
  const snap = await getDoc(orderRef);

  if (!snap.exists()) throw new Error("Order no encontrado");

  await deleteDoc(orderRef);

  const resultado = { mensaje: "Order eliminado correctamente", id: orderId };
  return resultado;
}