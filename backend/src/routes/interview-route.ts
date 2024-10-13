import express from "express";
import * as InterviewController from "../controllers/interview-controller"; // Controller'ı import et

const router = express.Router();

// Mülakat oluşturma rotası
router.post("/", InterviewController.createInterview);
router.get("/", InterviewController.getInterviews);    // Tüm interview'ları getirme rotası
router.delete("/:interviewId", InterviewController.deleteInterview);

router.get("/:interviewId/packages/questions", InterviewController.getPackageQuestionsByInterview);


export default router;
