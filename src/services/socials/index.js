import { db } from "@/lib/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";

const socialsRef = collection(db, "socials");

// Buscador de todas las redes
export async function getSocials() {
  const snapshot = await getDocs(socialsRef);
  const socials = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return socials;
}

export async function getSocialById(socialId) {
  if (!socialId) throw new Error("No se recibió socialId");

  const socialRef = doc(db, "socials", socialId);
  const snapshot = await getDoc(socialRef);

  if (!snapshot.exists()) throw new Error("Social no encontrada");

  const social = { id: snapshot.id, ...snapshot.data() };
  return social;
}

export async function createSocial(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Datos inválidos");
  }
  const nuevoSocial = data;
  const docRef = await addDoc(socialsRef, nuevoSocial);
  const socialCreado = { id: docRef.id, ...nuevoSocial };
  return socialCreado;
}

export async function updateSocial(socialId, data) {
  if (!socialId || !data || typeof data !== "object") {
    throw new Error("ID y datos válidos requeridos");
  }

  const socialRef = doc(db, "socials", socialId);
  const snap = await getDoc(socialRef);

  if (!snap.exists()) throw new Error("Social no encontrado");

  await updateDoc(socialRef, data);
  const socialActualizado = { id: socialId, ...data };
  return socialActualizado;
}

export async function deleteSocial(socialId) {
  if (!socialId) throw new Error("No se recibió socialId");

  const socialRef = doc(db, "socials", socialId);
  const snap = await getDoc(socialRef);

  if (!snap.exists()) throw new Error("Social no encontrado");

  await deleteDoc(socialRef);

  const resultado = { mensaje: "Social eliminado correctamente", id: socialId };
  return resultado;
}