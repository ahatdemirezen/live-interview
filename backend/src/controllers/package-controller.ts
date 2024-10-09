import { Request, Response, NextFunction, RequestHandler } from "express";


import {
  createPackageService,
  getAllPackagesService,
  deletePackageService,
  updatePackageTitle,
  deleteQuestionFromPackageService,
  addNewQuestions,
  updateQuestionService,
  getPackageByIdService,
} from "../services/package-service"; // Service'i import et

// Package oluşturma
export const createPackage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, questions } = req.body;
    const savedPackage = await createPackageService(title, questions);
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

  try {
    const { packageId } = req.params;
    const deletedPackage = await deletePackageService(packageId);
    res.status(200).json({ message: "Package deleted successfully", deletedPackage });
  } catch (error) {
    next(error);
  }
};

// Package güncelleme
export const updatePackageTitleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { packageId } = req.params;
  const { title } = req.body;

  try {
    const updatedPackage = await updatePackageTitle(packageId, title);
    res.status(200).json(updatedPackage);
  } catch (error) {
    next(error);
  }
};


// Soruları silme
export const deleteQuestionController = async (req: Request, res: Response, next: NextFunction) => {
  const { packageId } = req.params;
  const { questionId } = req.body; // questionId'yi body'den alıyoruz.

  try {
    const updatedPackage = await deleteQuestionFromPackageService(packageId, questionId);
    res.status(200).json({
      message: "Question deleted successfully",
      package: updatedPackage,
    });
  } catch (error) {
    next(error);
  }
};

export const updateQuestionController = async (req: Request, res: Response, next: NextFunction) => {
  const { packageId, questionId } = req.params; // URL'den packageId ve questionId'yi alıyoruz
  const { questionText, timeLimit } = req.body; // Güncellenecek verileri body'den alıyoruz

  try {
    const updatedPackage = await updateQuestionService(packageId, questionId, {
      questionText,
      timeLimit,
    });
    res.status(200).json({
      message: "Question updated successfully",
      package: updatedPackage,
    });
  } catch (error) {
    next(error); // Hata varsa sonraki middleware'e gönder
  }
};


// Yeni sorular ekleme
export const addNewQuestionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { packageId } = req.params;
  const { newQuestions } = req.body;

  try {
    const updatedPackage = await addNewQuestions(packageId, newQuestions);
    res.status(201).json({
      message: "Questions added successfully",
      package: updatedPackage,
    });
  } catch (error) {
    next(error);
  }
};


export const getPackageById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { packageId } = req.params;

  try {
    const packageData = await getPackageByIdService(packageId);
    if (!packageData) {
      res.status(404).json({ message: "Package not found" });
    } else {
      res.status(200).json(packageData); // Response döndürülüyor
    }
  } catch (error) {
    next(error); // Hata döndürülüyor
  }
};