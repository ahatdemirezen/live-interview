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

export const updateQuestionService = async (
  packageId: string,
  questionId: string,
  updates: { questionText?: string; timeLimit?: number }
) => {
  // packageId ve questionId'nin geçerli olup olmadığını kontrol et
  if (!mongoose.isValidObjectId(packageId) || !mongoose.isValidObjectId(questionId)) {
    throw createHttpError(400, "Invalid packageId or questionId");
  }

  // İlgili package'i bul
  const packageData = await Package.findById(packageId);
  if (!packageData) {
    throw createHttpError(404, "Package not found");
  }

  // Soruyu bul ve güncelle
  const question = packageData.questions.id(questionId);
  if (!question) {
    throw createHttpError(404, "Question not found");
  }

  if (updates.questionText) {
    question.questionText = updates.questionText;
  }
  if (updates.timeLimit) {
    question.timeLimit = updates.timeLimit;
  }

  // Güncellemeleri kaydet ve güncellenmiş paketi döndür
  const updatedPackage = await packageData.save();
  return updatedPackage;
};


export const updateQuestionOrderService = async (
  packageId: string,
  questions: { questionId: string; sequenceNumber: number }[]
) => {
  const packageData = await Package.findById(packageId); // Paketi veritabanından bul

  if (!packageData) {
    throw new Error('Package not found'); // Eğer paket bulunmazsa hata fırlat
  }

  // Soruların sıralamasını güncelle
  questions.forEach((q) => {
    const question = packageData.questions.id(q.questionId); // Soruyu bul
    if (question) {
      question.sequenceNumber = q.sequenceNumber; // Yeni sıralamayı atayın
    }
  });

  await packageData.save(); // Paketi kaydet (MongoDB'ye güncellemeleri kaydet)
  return packageData; // Güncellenmiş paketi geri döndür
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

  // Mevcut soruların sayısını alın, bu sequenceNumber'ın başlangıcı olacak
  const currentQuestionCount = packageData.questions.length;

  // Yeni soruları sıralama numarası ekleyerek ekleyin
  newQuestions.forEach(({ questionText, timeLimit }, index) => {
    packageData.questions.push({
      questionText,
      timeLimit,
      sequenceNumber: currentQuestionCount + index + 1, // Sıra numarası birer artarak devam edecek
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