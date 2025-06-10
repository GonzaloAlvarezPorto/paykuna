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

  const {
    emailCliente,
    telefonoCliente,
    nombreCliente,
    apellidoCliente,
    retiro,
    tipoPago,
    direccionCliente,
    localidadCliente,
    costoEnvio = 0,
    carrito = [],
    pagado = 0,
    estado = 'Por preparar'
  } = data;

  const hoy = new Date();

  const fechaClave = hoy.toISOString().split("T")[0]; // yyyy-mm-dd
  const fechaIngreso = hoy.toLocaleDateString("es-AR"); // dd/mm/yyyy

  // Obtener todas las órdenes para contar las del día
  const snapshot = await getDocs(ordersRef);
  const pedidos = snapshot.docs.map(doc => doc.data());

  const pedidosHoy = pedidos.filter(p => p.fechaClave === fechaClave);
  const correlativo = String(pedidosHoy.length + 1).padStart(4, "0");

  const numeroOrden = `${hoy.getFullYear()}${String(hoy.getMonth() + 1).padStart(2, "0")}${String(hoy.getDate()).padStart(2, "0")}-${correlativo}`;

  const totalProductos = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const totalCompra = totalProductos + (retiro === "envio" ? costoEnvio : 0);

  const nuevoOrder = {
    numeroOrden,
    fechaIngreso,
    fechaClave,
    emailCliente,
    telefonoCliente,
    nombreCliente,
    apellidoCliente,
    retiro,
    tipoPago,
    direccionCliente: retiro === "envio" ? direccionCliente : null,
    localidadCliente: retiro === "envio" ? localidadCliente : null,
    costoEnvio: retiro === "envio" ? costoEnvio : 0,
    carrito,
    totalProductos,
    totalCompra,
    pagado,
    estado
  };

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