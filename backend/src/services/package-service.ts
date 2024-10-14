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

export const updateQuestionSequenceService = async (
  packageId: string,
  questionId: string,
  newSequenceNumber: number
) => {
  // Package ID ve Question ID'nin geçerliliğini kontrol edelim
  if (!mongoose.Types.ObjectId.isValid(packageId)) {
    throw new Error("Geçersiz Package ID");
  }

  const questionObjectId = new mongoose.Types.ObjectId(questionId);

  if (!mongoose.Types.ObjectId.isValid(questionObjectId)) {
      throw new Error("Geçersiz Question ID");
  }
  

  // Sıra numarasının geçerli olup olmadığını kontrol et
  if (typeof newSequenceNumber !== "number" || newSequenceNumber < 1) {
    throw new Error("Geçersiz yeni sıra numarası");
  }

  // Package'ı ve içindeki soruyu bul
  const packageData = await Package.findById(packageId);
  if (!packageData) {
    throw new Error("Package not found");
  }

  const question = packageData.questions.id(questionId);
  if (!question) {
    throw new Error("Question not found");
  }

  // question.sequenceNumber'ın varlığını kontrol et
  const currentSequenceNumber = question.sequenceNumber ?? 0; // Eğer sequenceNumber 'null' veya 'undefined' ise varsayılan değer olarak 0 kullan
  if (currentSequenceNumber === 0) {
    throw new Error("Mevcut sıra numarası bulunamadı.");
  }

  // Eğer yeni sıra numarası mevcut sıra numarasından farklıysa güncellemeyi yap
  if (newSequenceNumber !== currentSequenceNumber) {
    // Aşağıdaki diğer soruların sıra numaralarını güncelle
    packageData.questions.forEach(q => {
      // q.sequenceNumber'ın varlığını kontrol et
      const seqNum = q.sequenceNumber ?? 0;
      if (newSequenceNumber > currentSequenceNumber) {
        if (seqNum > currentSequenceNumber && seqNum <= newSequenceNumber) {
          q.sequenceNumber = seqNum - 1;
        }
      } else if (newSequenceNumber < currentSequenceNumber) {
        if (seqNum >= newSequenceNumber && seqNum < currentSequenceNumber) {
          q.sequenceNumber = seqNum + 1;
        }
      }
    });

    // Seçili sorunun sıra numarasını güncelle
    question.sequenceNumber = newSequenceNumber;
    await packageData.save();
  }

  return packageData; // Güncellenmiş package verisini geri döndür
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