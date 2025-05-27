import { db } from "@/lib/firebase.js";
import { collection, getDocs, addDoc, doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";

const clientesRef = collection(db, "clients");

// Obtener todos los clientes
export async function getClients() {
  const snapshot = await getDocs(clientesRef);
  const clientes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return clientes;
}

// Obtener un cliente por ID
export async function getClientById(clientId) {
  if (!clientId) throw new Error("No se recibió clientId");

  const clienteRef = doc(db, "clients", clientId);
  const snapshot = await getDoc(clienteRef);

  if (!snapshot.exists()) throw new Error("Cliente no encontrado");

  const cliente = { id: snapshot.id, ...snapshot.data() };
  return cliente;
}

// Crear un cliente vacío
export async function createClient(data) {

  if (!data || typeof data !== "object") {
        throw new Error("Datos inválidos");
    }
  
  const nuevoCliente = data;
  const docRef = await addDoc(clientesRef, nuevoCliente);
  const clienteCreado = { id: docRef.id, ...nuevoCliente };
  return clienteCreado;
}

// Actualizar datos de un cliente
export async function updateClient(clientId, data) {
  if (!clientId || !data || typeof data !== "object") {
    throw new Error("ID y datos válidos requeridos");
  }

  const clienteRef = doc(db, "clients", clientId);
  const snap = await getDoc(clienteRef);

  if (!snap.exists()) throw new Error("Cliente no encontrado");

  await updateDoc(clienteRef, data);
  const clienteActualizado = { id: clientId, ...data };
  return clienteActualizado;
}

// Eliminar un cliente
export async function deleteClient(clientId) {
  if (!clientId) throw new Error("No se recibió clientId");

  const clienteRef = doc(db, "clients", clientId);
  const snap = await getDoc(clienteRef);

  if (!snap.exists()) throw new Error("Cliente no encontrado");

  await deleteDoc(clienteRef);

  const resultado = { mensaje: "Cliente eliminado correctamente", id: clientId };
  return resultado;
}