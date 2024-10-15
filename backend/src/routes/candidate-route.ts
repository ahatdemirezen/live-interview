import express from 'express';
import { getAllPersonalInfo, createPersonalInfo } from '../controllers/candidate-controller';

const router = express.Router();

// GET request - Tüm kişisel bilgileri getirir
router.get("/", getAllPersonalInfo);

// POST request - Yeni kişisel bilgi ekler
router.post("/:interviewId", createPersonalInfo);

export default router;
