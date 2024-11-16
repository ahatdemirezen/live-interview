"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const InterviewController = __importStar(require("../controllers/interview-controller")); // Controller'ı import et
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Mülakat oluşturma rotası
router.post("/", auth_1.authenticateToken, InterviewController.createInterview);
router.get("/", auth_1.authenticateToken, InterviewController.getInterviews); // Tüm interview'ları getirme rotası
router.delete("/:interviewId", auth_1.authenticateToken, InterviewController.deleteInterview);
router.get("/:interviewId/packages/questions", InterviewController.getPackageQuestionsByInterview);
router.get("/:interviewId/expire-date", InterviewController.getInterviewExpireDate);
router.get('/:interviewId/personal-forms', auth_1.authenticateToken, InterviewController.getPersonalFormsByInterview);
router.get("/:interviewId/settings", InterviewController.getInterviewSettings);
router.get("/ids", InterviewController.getInterviewIds);
router.patch("/:interviewId", auth_1.authenticateToken, InterviewController.updateInterview);
exports.default = router;
