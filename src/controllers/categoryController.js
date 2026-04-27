import { db } from "../firebase.js";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const categoriesCollection = collection(db, "categories");

export async function getCategories(req, res) {
  const snapshot = await getDocs(categoriesCollection);
  const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(categories);
}

export async function createCategory(req, res) {
  const { nombre, descripcion } = req.body;
  const docRef = await addDoc(categoriesCollection, { nombre, descripcion });
  res.json({ id: docRef.id, nombre, descripcion });
}

export async function updateCategory(req, res) {
  const { id } = req.params;
  const data = req.body;
  const categoryRef = doc(db, "categories", id);
  await updateDoc(categoryRef, data);
  res.json({ id, ...data });
}

export async function deleteCategory(req, res) {
  const { id } = req.params;
  await deleteDoc(doc(db, "categories", id));
  res.json({ message: "Categoría eliminada" });
}
