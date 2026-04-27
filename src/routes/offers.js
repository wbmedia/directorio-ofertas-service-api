import express from "express";
import { getOffers, createOffer, updateOffer, deleteOffer, suggestOfferDescription } from "../controllers/offerController.js";
import { authMiddleware, authorizeRoles  } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getOffers);
router.post("/", authMiddleware, authorizeRoles("vendedor"), createOffer);
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateOffer);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteOffer);
router.post("/suggest", authMiddleware, authorizeRoles("vendedor"), suggestOfferDescription);

export default router;
