import express from "express";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { authMiddleware, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCategories);

router.post("/", authMiddleware, authorizeRoles("admin"), createCategory);
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateCategory);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteCategory);

export default router;
