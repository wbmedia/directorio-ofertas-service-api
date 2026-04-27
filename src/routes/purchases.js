import express from "express";
import { getPurchases, createPurchase, deletePurchase  } from "../controllers/purchaseController.js";
import { authMiddleware, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Solo clientes pueden registrar compras
router.get("/", authMiddleware, authorizeRoles("admin"), getPurchases);
router.post("/", authMiddleware, authorizeRoles("cliente"), createPurchase);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deletePurchase);

export default router;
