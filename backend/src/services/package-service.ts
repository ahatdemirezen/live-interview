import Package from "../models/package-model"; // Package şemasını import et
import mongoose from "mongoose";
import createHttpError from "http-errors";

// Package oluşturma servisi
export const createPackageService = async (Title: string, questions: any[]) => {
  const newPackage = new Package({
    Title,
    questions,
  });

  // Veritabanına kaydet
  const savedPackage = await newPackage.save();
  return savedPackage;
};

// Tüm package'ları getirme servisi
export const getAllPackagesService = async () => {
  const packages = await Package.find(); // Tüm paketleri veritabanından çek
  return packages;
};

// Package silme servisi
export const deletePackageService = async (packageId: string) => {
  // packageId'nin geçerli olup olmadığını kontrol et
  if (!mongoose.isValidObjectId(packageId)) {
    throw createHttpError(400, "Invalid packageId");
  }

  // İlgili package'i bul ve sil
  const deletedPackage = await Package.findByIdAndDelete(packageId);

  // Package bulunamadıysa hata fırlat
  if (!deletedPackage) {
    throw createHttpError(404, "Package not found");
  }

  return deletedPackage;
};

// Package güncelleme servisi
export const updatePackageService = async (
  packageId: string,
  title?: string,
  reorderedQuestions?: { id: string; sequenceNumber: number }[],
  deletedQuestionIds?: string[],
  newQuestions?: { questionText: string; timeLimit: number }[]
) => {
  // packageId'nin geçerli olup olmadığını kontrol et
  if (!mongoose.isValidObjectId(packageId)) {
    throw createHttpError(400, "Invalid packageId");
  }

  // İlgili package'i bul
  const packageData = await Package.findById(packageId);
  if (!packageData) {
    throw createHttpError(404, "Package not found");
  }

  // 1. Package başlığı güncelleme
  if (title) {
    packageData.Title = title;
  }

  // 2. Soruları yeniden sıralama
  if (reorderedQuestions && reorderedQuestions.length > 0) {
    reorderedQuestions.forEach((question: { id: string; sequenceNumber: number }) => {
      const questionToUpdate = packageData.questions.id(question.id);
      if (questionToUpdate) {
        questionToUpdate.sequenceNumber = question.sequenceNumber;
      }
    });
  }

  // 3. Soruları silme
  if (deletedQuestionIds && deletedQuestionIds.length > 0) {
    deletedQuestionIds.forEach((questionId: string) => {
      // questions dizisinden questionId'ye sahip soruyu çıkar
      packageData.questions.pull({ _id: questionId });
    });
  }

  // 4. Yeni soru ekleme
  if (newQuestions && newQuestions.length > 0) {
    newQuestions.forEach((newQuestion: { questionText: string; timeLimit: number }) => {
      const sequenceNumber = packageData.questions.length + 1;
      packageData.questions.push({
        questionText: newQuestion.questionText,
        timeLimit: newQuestion.timeLimit,
        sequenceNumber: sequenceNumber,
      });
    });
  }

  // Güncellenmiş paketi kaydet
  const updatedPackage = await packageData.save();
  return updatedPackage;
};
