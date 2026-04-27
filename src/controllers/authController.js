import { db } from "../firebase.js";
import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const usersCollection = collection(db, "users");

export async function register(req, res) {
  const { nombre, email, password, rol = "cliente" } = req.body; // rol por defecto cliente
  const hashed = await bcrypt.hash(password, 10);

  const userRef = doc(usersCollection);
  await setDoc(userRef, { nombre, email, passwordHash: hashed, rol });

  res.json({ id: userRef.id, nombre, email, rol });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const q = query(usersCollection, where("email", "==", email));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return res.status(404).json({ error: "Usuario no encontrado" });

  const user = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) return res.status(401).json({ error: "Credenciales inválidas" });

  // 🔑 Incluir rol en el token
  const token = jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token, user });
}
