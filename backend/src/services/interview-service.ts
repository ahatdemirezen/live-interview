import Interview from "../models/interview-model";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import Package from "../models/package-model"; // Package şemasını import et

// Interview oluşturma servisi
export const createInterviewService = async (interviewTitle: string, expireDate: Date, packageId: string) => {
  // packageId'nin geçerli bir ObjectId olup olmadığını kontrol et
  if (!mongoose.isValidObjectId(packageId)) {
    throw createHttpError(400, "Invalid packageId format");
  }

  // packageId'ye sahip bir Package var mı diye kontrol et
  const packageExists = await Package.findById(packageId);
  if (!packageExists) {
    throw createHttpError(404, "Package not found");
  }

  // Interview nesnesini oluştur
  const newInterview = new Interview({
    interviewTitle,
    expireDate,
    packageId, // Seçilen paketi ilişkilendir
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