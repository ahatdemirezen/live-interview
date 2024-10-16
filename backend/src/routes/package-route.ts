import express from "express";
import * as PackageController from "../controllers/package-controller"; // Controller'ı import et

const router = express.Router();

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

export default router;
