import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getPedidoById(pedidoId) {
    const pedidoDoc = await getDoc(doc(db, "pedidos", pedidoId));

    if (!pedidoDoc.exists()) {
        return null;
    }

    return { id: pedidoDoc.id, ...pedidoDoc.data() };
}
