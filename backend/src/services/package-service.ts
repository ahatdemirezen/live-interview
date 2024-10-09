import Package from "../models/package-model"; // Package şemasını import et
import mongoose from "mongoose";
import createHttpError from "http-errors";

// Package oluşturma servisi
export const createPackageService = async (title: string, questions: any[]) => {
  const newPackage = new Package({
    title,
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
export const updatePackageTitle = async (packageId: string, title: string) => {
  if (!mongoose.isValidObjectId(packageId)) {
    throw createHttpError(400, "Invalid packageId");
  }

  const packageData = await Package.findById(packageId);
  if (!packageData) {
    throw createHttpError(404, "Package not found");
  }

  packageData.title = title;
  const updatedPackage = await packageData.save();
  return updatedPackage;
};

// Soruları silme fonksiyonu
export const deleteQuestionFromPackageService = async (packageId: string, questionId: string) => {
  if (!mongoose.isValidObjectId(packageId) || !mongoose.isValidObjectId(questionId)) {
    throw createHttpError(400, "Invalid packageId or questionId");
  }

  const packageData = await Package.findById(packageId);
  if (!packageData) {
    throw createHttpError(404, "Package not found");
  }

  const question = packageData.questions.id(questionId);
  if (!question) {
    throw createHttpError(404, "Question not found");
  }

  packageData.questions.pull({ _id: questionId });

  const updatedPackage = await packageData.save();
  return updatedPackage;
};

// Yeni sorular ekleme fonksiyonu
export const addNewQuestions = async (
  packageId: string,
  newQuestions: { questionText: string; timeLimit: number }[]
) => {
  if (!mongoose.isValidObjectId(packageId)) {
    throw createHttpError(400, "Invalid packageId");
  }

  const packageData = await Package.findById(packageId);
  if (!packageData) {
    throw createHttpError(404, "Package not found");
  }

  // newQuestions'ın undefined olup olmadığını kontrol et
  if (!newQuestions || !Array.isArray(newQuestions)) {
    throw createHttpError(400, "newQuestions is required and should be an array");
  }

  newQuestions.forEach(({ questionText, timeLimit }) => {
    packageData.questions.push({
      questionText,
      timeLimit,
    });
  });

  const updatedPackage = await packageData.save();
  return updatedPackage;
};



export const getPackageByIdService = async (packageId: string) => {
  if (!packageId) {
    throw createHttpError(400, "Package ID is required");
  }
  
  const packageData = await Package.findById(packageId);
  if (!packageData) {
    throw createHttpError(404, "Package not found");
  }
  return packageData;
};