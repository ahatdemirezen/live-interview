import express from "express";
import { createUser , checkToken , logoutUser } from "../controllers/login-controller";

const router = express.Router();

// POST isteği için rota
router.post("/", createUser);

router.get("/check-token", checkToken);

router.post("/logout", logoutUser);

export default router;
