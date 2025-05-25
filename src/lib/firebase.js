// lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDEzvh-fLQGIu9g0kyl60BbH1F3C7MKe9M",
  authDomain: "almacenpaykuna.firebaseapp.com",
  projectId: "almacenpaykuna",
  storageBucket: "almacenpaykuna.firebasestorage.app",
  messagingSenderId: "19301619564",
  appId: "1:19301619564:web:7201da74b362de1e110549"
};

// Evitar inicializar varias apps si ya está inicializada
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Crear instancia Firestore
export const db = getFirestore(app);
