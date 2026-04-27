import { db } from "../firebase.js";
import { collection, addDoc, getDocs } from "firebase/firestore";

const purchasesCollection = collection(db, "purchases");

export async function getPurchases(req, res) {
  const snapshot = await getDocs(purchasesCollection);
  const purchases = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(purchases);
}

export async function createPurchase(req, res) {
  const { usuarioId, ofertaId, monto } = req.body;
  const docRef = await addDoc(purchasesCollection, {
    usuarioId,
    ofertaId,
    monto,
    fechaCompra: new Date()
  });
  res.json({ id: docRef.id, usuarioId, ofertaId, monto });
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
