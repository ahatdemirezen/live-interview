import Interview from "../models/interview-model";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import Package from "../models/package-model"; // Package şemasını import et

// Interview oluşturma servisi
export const createInterviewService = async (interviewTitle: string, expireDate: Date, packageIds: string[]) => {
  // Gelen packageIds'in bir array olup olmadığını kontrol et
  if (!Array.isArray(packageIds)) {
    throw createHttpError(400, "packageIds must be an array");
  }

  // Her bir packageId'nin geçerli bir ObjectId olup olmadığını ve var olup olmadığını kontrol et
  for (const packageId of packageIds) {
    if (!mongoose.isValidObjectId(packageId)) {
      throw createHttpError(400, `Invalid packageId format: ${packageId}`);
    }

    const packageExists = await Package.findById(packageId);
    if (!packageExists) {
      throw createHttpError(404, `Package not found: ${packageId}`);
    }
  }

  // Interview nesnesini oluştur
  const newInterview = new Interview({
    interviewTitle,
    expireDate,
    packageId: packageIds, // Artık bir array olarak kaydediyoruz
  });

  // Veritabanına kaydet
  const savedInterview = await newInterview.save();

  return savedInterview;
};


// Tüm interview'ları getirme servisi
export const getInterviewsService = async () => {
  const interviews = await Interview.find(); // Tüm interview'ları veritabanından çek
  return interviews;
};


export const deleteInterviewService = async (interviewId: string) => {
    // interviewId'nin geçerli olup olmadığını kontrol et
    if (!mongoose.isValidObjectId(interviewId)) {
      throw createHttpError(400, "Invalid interviewId");
    }
  
    // İlgili interview'ı bul ve sil
    const deletedInterview = await Interview.findByIdAndDelete(interviewId);
  
    // Interview bulunamadıysa hata fırlat
    if (!deletedInterview) {
      throw createHttpError(404, "Interview not found");
    }
  
    return deletedInterview;
  };