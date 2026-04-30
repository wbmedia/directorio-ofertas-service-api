import { Router } from "express";
import { getUsers, updateUserRole, deleteUser } from "../controllers/userController.js";
import { authMiddleware, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, authorizeRoles("admin"), getUsers);
router.put("/:id/role", authMiddleware, authorizeRoles("admin"), updateUserRole);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteUser);

export default router;
