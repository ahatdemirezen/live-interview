"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const candidate_controller_1 = require("../controllers/candidate-controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// GET request - Tüm kişisel bilgileri getirir
router.get("/", candidate_controller_1.getAllPersonalInfo);
// POST request - Yeni kişisel bilgi ekler
router.post("/:interviewId", candidate_controller_1.createPersonalInfo);
router.patch("/status", auth_1.authenticateToken, candidate_controller_1.updateCandidateStatus);
router.patch("/:formId/note", auth_1.authenticateToken, candidate_controller_1.updateCandidateNote);
router.patch("/:formId/alert", candidate_controller_1.updateUserAlert);
exports.default = router;
