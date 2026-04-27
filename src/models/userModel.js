import { db } from "../firebase.js";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

const usersCollection = collection(db, "users");

export async function createUser(userData) {
  const userRef = doc(usersCollection);
  await setDoc(userRef, userData);
  return { id: userRef.id, ...userData };
}

export async function getUserById(id) {
  const userRef = doc(db, "users", id);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}
