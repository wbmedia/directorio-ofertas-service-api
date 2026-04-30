// Package imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routes imports
import authRouter from "./routes/auth.js";
import offersRouter from "./routes/offers.js";
import categoriesRouter from "./routes/categories.js";
import purchasesRouter from "./routes/purchases.js";
import usersRouter from "./routes/users.js";

// Confiuration 
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/offers", offersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/purchases", purchasesRouter);
app.use("/api/users", usersRouter);


// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
