import { db } from "../firebase.js";
import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { generarDescripcion } from "../services/aiService.js";

const offersCollection = collection(db, "offers");

export async function getOffers(req, res) {
  try {
    const snapshot = await getDocs(offersCollection);
    const offers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las ofertas", details: error.message });
  }
}

export async function createOffer(req, res) {
  try {
    const { titulo, descripcion, precio, usuarioId, categoriaId } = req.body;

    let finalDescripcion = descripcion;
    if (!descripcion || descripcion.trim() === "") {
      finalDescripcion = await generarDescripcion(titulo, precio);
    }

    const docRef = await addDoc(offersCollection, {
      titulo,
      descripcion: finalDescripcion,
      precio,
      usuarioId,
      categoriaId,
      estado: "activo",
      fechaInicio: new Date(),
      fechaFin: new Date()
    });

    res.json({ id: docRef.id, titulo, descripcion: finalDescripcion, precio });
  } catch (error) {
    res.status(500).json({ error: "Error al crear la oferta", details: error.message });
  }
}

export async function updateOffer(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const offerRef = doc(db, "offers", id);

    const snapshot = await getDoc(offerRef);
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Oferta no encontrada" });
    }

    if (!data.descripcion || data.descripcion.trim() === "") {
      data.descripcion = await generarDescripcion(
        data.titulo || snapshot.data().titulo,
        data.precio || snapshot.data().precio
      );
    }

    await updateDoc(offerRef, data);
    res.json({ message: "Oferta actualizada correctamente", id, ...data });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la oferta", details: error.message });
  }
}

export async function deleteOffer(req, res) {
  try {
    const { id } = req.params;
    const offerRef = doc(db, "offers", id);

    const snapshot = await getDoc(offerRef);
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Oferta no encontrada" });
    }

    await deleteDoc(offerRef);
    res.json({ message: "Oferta eliminada correctamente", id });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la oferta", details: error.message });
  }
}

export async function suggestOfferDescription(req, res) {
  try {
    const { titulo, precio } = req.body;

    if (!titulo) {
      return res.status(400).json({ error: "Se requiere el título para generar la sugerencia" });
    }

    const descripcion = await generarDescripcion(titulo, precio);
    res.json({ sugerencia: descripcion });
  } catch (error) {
    res.status(500).json({ error: "Error al generar la descripción", details: error.message });
  }
}
