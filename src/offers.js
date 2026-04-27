import express from "express";
import { db } from "../firebase.js";
import { collection, addDoc, getDocs } from "firebase/firestore";

const router = express.Router();

router.get("/", async (req, res) => {
  const snapshot = await getDocs(collection(db, "offers"));
  const offers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(offers);
});

router.post("/", async (req, res) => {
  const { titulo, descripcion, precio, usuarioId, categoriaId } = req.body;
  const docRef = await addDoc(collection(db, "offers"), {
    titulo, descripcion, precio, usuarioId, categoriaId,
    estado: "activa", fechaInicio: new Date(), fechaFin: new Date()
  });
  res.json({ id: docRef.id });
});

export default router;
