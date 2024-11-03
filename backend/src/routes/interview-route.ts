import express from "express";
import * as InterviewController from "../controllers/interview-controller"; // Controller'ı import et
import { authenticateToken } from "../middleware/auth";
 
const router = express.Router();

// Mülakat oluşturma rotası
router.post("/", authenticateToken, InterviewController.createInterview);
router.get("/",  authenticateToken, InterviewController.getInterviews);    // Tüm interview'ları getirme rotası
router.delete("/:interviewId",  authenticateToken, InterviewController.deleteInterview);

router.get("/:interviewId/packages/questions",  InterviewController.getPackageQuestionsByInterview);

router.get("/:interviewId/expire-date", InterviewController.getInterviewExpireDate);

router.get('/:interviewId/personal-forms', authenticateToken, InterviewController.getPersonalFormsByInterview);

router.get("/:interviewId/settings", InterviewController.getInterviewSettings);

router.get("/ids", InterviewController.getInterviewIds);

router.patch("/:interviewId", authenticateToken, InterviewController.updateInterview);

export default router;
