import { db } from "../firebase.js";
import { collection, doc, addDoc, getDocs, getDoc, deleteDoc } from "firebase/firestore";

const purchasesCollection = collection(db, "purchases");
const usersCollection = collection(db, "users");
const offersCollection = collection(db, "offers");

export async function getPurchases(req, res) {
  try {
    const snapshot = await getDocs(purchasesCollection);
    const purchases = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    // Enriquecer con clienteNombre y ofertaTitulo para el dashboard
    const [usersSnap, offersSnap] = await Promise.all([
      getDocs(usersCollection),
      getDocs(offersCollection)
    ]);

    const usersMap = Object.fromEntries(usersSnap.docs.map(d => [d.id, d.data()]));
    const offersMap = Object.fromEntries(offersSnap.docs.map(d => [d.id, d.data()]));

    const enriched = purchases.map(p => ({
      ...p,
      clienteNombre: usersMap[p.usuarioId]?.nombre ?? null,
      ofertaTitulo: offersMap[p.ofertaId]?.titulo ?? null,
      fecha: p.fechaCompra ?? null
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las compras", details: error.message });
  }
}

export async function createPurchase(req, res) {
  try {
    const { usuarioId, ofertaId, monto } = req.body;
    const fecha = new Date();
    const docRef = await addDoc(purchasesCollection, {
      usuarioId,
      ofertaId,
      monto,
      fechaCompra: fecha,
      fecha
    });
    res.json({ id: docRef.id, usuarioId, ofertaId, monto, fecha });
  } catch (error) {
    res.status(500).json({ error: "Error al crear la compra", details: error.message });
  }
}

export async function deletePurchase(req, res) {
  try {
    const { id } = req.params;
    const purchaseRef = doc(db, "purchases", id);

    const snapshot = await getDoc(purchaseRef);
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Compra no encontrada" });
    }

    await deleteDoc(purchaseRef);
    res.json({ message: "Compra eliminada correctamente", id });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la compra", details: error.message });
  }
}
