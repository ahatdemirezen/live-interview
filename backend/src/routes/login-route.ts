import express from "express";
import { createUser } from "../controllers/login-controller";

const router = express.Router();

// POST isteği için rota
router.post("/", createUser);

export default router;
