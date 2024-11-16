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
const PackageController = __importStar(require("../controllers/package-controller")); // Controller'ı import et
const router = express_1.default.Router();
// Package oluşturma rotası
router.post("/", PackageController.createPackage);
// Tüm paketleri listeleme rotası
router.get("/", PackageController.getAllPackages);
// Belirli bir paketi ID ile getirme rotası
router.get("/:packageId", PackageController.getPackageById);
// Package silme rotası
router.delete("/:packageId", PackageController.deletePackage);
// Package başlığını güncelleme rotası (PATCH metodu)
router.patch("/:packageId/title", PackageController.updatePackageTitleController);
// Soruları silme rotası (PATCH metodu)
router.delete("/:packageId/questions", PackageController.deleteQuestionController);
router.patch("/:packageId/questions/:questionId", PackageController.updateQuestionController);
// Yeni sorular ekleme rotası (PATCH metodu)
router.post("/:packageId/questions", PackageController.addNewQuestionsController);
router.post('/:packageId/update-order', PackageController.updateQuestionOrderController);
exports.default = router;
