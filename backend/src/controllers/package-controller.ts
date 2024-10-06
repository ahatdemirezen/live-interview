import { Request, Response, NextFunction } from "express";
import {
  createPackageService,
  getAllPackagesService,
  deletePackageService,
  updatePackageService,
} from "../services/package-service"; // Service'i import et

// Package oluşturma
export const createPackage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { Title, questions } = req.body;
    const savedPackage = await createPackageService(Title, questions);
    res.status(201).json(savedPackage);
  } catch (error) {
    next(error);
  }
};

// Tüm package'ları getirme
export const getAllPackages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const packages = await getAllPackagesService();
    res.status(200).json(packages);
  } catch (error) {
    next(error);
  }
};

// Package silme
export const deletePackage = async (req: Request, res: Response, next: NextFunction) => {
  const { packageId } = req.params;

  try {
    const deletedPackage = await deletePackageService(packageId);
    res.status(200).json({ message: "Package deleted successfully", deletedPackage });
  } catch (error) {
    next(error);
  }
};

// Package güncelleme
export const updatePackage = async (req: Request, res: Response, next: NextFunction) => {
  const { packageId } = req.params;
  const { title, reorderedQuestions, deletedQuestionIds, newQuestions } = req.body;

  try {
    const updatedPackage = await updatePackageService(
      packageId,
      title,
      reorderedQuestions,
      deletedQuestionIds,
      newQuestions
    );
    res.status(200).json(updatedPackage);
  } catch (error) {
    next(error);
  }
};
