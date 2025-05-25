import { db } from "./firebase.js";
import { collection, query, where, getDocs, addDoc, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

const clientesRef = collection(db, "clientes");

//buscamos un cliente por el email
export async function getClientByEmail(email) {
  const clientById = query(clientesRef, where("email", "==", email));
  const snapshot = await getDocs(clientById);

  if (!snapshot.empty) {
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  }

  return null;
}


export async function createClient(email) {
  const docRef = doc(clientesRef);
  const idClient = docRef.id;

  const nuevoCliente = {
    email,
    idClient
  };

  await setDoc(docRef, nuevoCliente);

  return { id: idClient, ...nuevoCliente };
}

export async function searchOrCreateClient(email) {

  const cliente = await getClientByEmail(email);
  if (cliente) return cliente.id;

  const nuevoCliente = await createClient(email);
  return nuevoCliente.id;

}

export async function deleteClient(clientId) {
  if (!clientId) throw new Error("No se recibió clienteId");

  const clienteRef = doc(db, "clientes", clientId);

  // Verificar si existe antes de borrar
  const snap = await getDoc(clienteRef);
  if (!snap.exists()) throw new Error("Cliente no encontrado");

  await deleteDoc(clienteRef);

  return { mensaje: "Cliente eliminado correctamente", id: clientId };
}
