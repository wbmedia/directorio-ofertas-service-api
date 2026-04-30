import { db } from "../firebase.js";
import { collection, doc, getDocs, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

const usersCollection = collection(db, "users");

export async function getUsers(req, res) {
  try {
    const snapshot = await getDocs(usersCollection);
    const users = snapshot.docs.map(d => {
      const { passwordHash, ...safeData } = d.data();
      return { id: d.id, ...safeData };
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios", details: error.message });
  }
}

export async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    const validRoles = ["admin", "vendedor", "cliente"];
    if (!rol || !validRoles.includes(rol)) {
      return res.status(400).json({ error: "Rol inválido. Debe ser: admin, vendedor o cliente" });
    }

    const userRef = doc(db, "users", id);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await updateDoc(userRef, { rol });
    res.json({ message: "Rol actualizado correctamente", id, rol });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el rol", details: error.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const userRef = doc(db, "users", id);

    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await deleteDoc(userRef);
    res.json({ message: "Usuario eliminado correctamente", id });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el usuario", details: error.message });
  }
}
