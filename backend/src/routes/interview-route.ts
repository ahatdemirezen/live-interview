import express from "express";
import * as InterviewController from "../controllers/interview-controller"; // Controller'ı import et
import { authenticateToken } from "../middleware/auth";
 
const router = express.Router();

// Mülakat oluşturma rotası
router.post("/", authenticateToken, InterviewController.createInterview);
router.get("/",  authenticateToken, InterviewController.getInterviews);    // Tüm interview'ları getirme rotası
router.delete("/:interviewId",  authenticateToken, InterviewController.deleteInterview);

router.get("/:interviewId/packages/questions",  authenticateToken, InterviewController.getPackageQuestionsByInterview);

router.get("/:interviewId/expire-date", InterviewController.getInterviewExpireDate);

router.get("/ids", InterviewController.getInterviewIds);

export default router;
