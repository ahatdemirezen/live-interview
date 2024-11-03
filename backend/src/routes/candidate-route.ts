import express from 'express';
import { getAllPersonalInfo, createPersonalInfo, updateCandidateStatus , updateCandidateNote , updateUserAlert } from '../controllers/candidate-controller';
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// GET request - Tüm kişisel bilgileri getirir
router.get("/", getAllPersonalInfo);

// POST request - Yeni kişisel bilgi ekler
router.post("/:interviewId", createPersonalInfo);

router.patch("/status" , authenticateToken, updateCandidateStatus)

router.patch("/:formId/note", authenticateToken, updateCandidateNote);

router.patch("/:formId/alert" , updateUserAlert)

export default router;
