import express from "express";
import { getOffers, createOffer, updateOffer, deleteOffer, suggestOfferDescription } from "../controllers/offerController.js";
import { authMiddleware, authorizeRoles  } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import { autoGenerateOffer } from "../controllers/offerController.js";

const router = express.Router();

router.get("/", getOffers);
router.post("/", authMiddleware, authorizeRoles("vendedor"), createOffer);
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateOffer);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteOffer);
router.post("/suggest", authMiddleware, authorizeRoles("vendedor"), suggestOfferDescription);
router.post(
  "/auto",
  authMiddleware,
  authorizeRoles("vendedor"),
  upload.single("foto"),
  autoGenerateOffer
);


export default router;
