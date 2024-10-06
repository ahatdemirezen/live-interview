import express from "express";
import * as PackageController from "../controllers/package-controller"; // Controller'ı import et

const router = express.Router();

// Package oluşturma rotası
router.post("/", PackageController.createPackage);

router.get("/list", PackageController.getAllPackages);

router.delete("/:packageId", PackageController.deletePackage); // Package silme rotası (DELETE metodu)

router.patch("/:packageId", PackageController.updatePackage);

export default router;
