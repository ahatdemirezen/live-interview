import Interview from "../models/interview-model";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import Package from "../models/package-model"; // Package şemasını import et
import PersonalInformationForm from "../models/candidate-model";
import { Document } from "mongoose";

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
  const interviews = await Interview.find().populate('personalInformationForms').lean();

  // Her interview için totalForms ve pendingForms sayısını hesapla
  const interviewsWithStats = interviews.map((interview) => {
    // `personalInformationForms` alanını any[] olarak dönüştürerek `status` alanına erişim sağlıyoruz
    const personalForms = interview.personalInformationForms as any[];

    const totalForms = personalForms.length;
    const pendingForms = personalForms.filter(
      (form) => form.status === 'pending'
    ).length;

    return {
      ...interview,
      totalForms,
      pendingForms,
    };
  });

  return interviewsWithStats;
};

export const fetchInterviewIds = async (): Promise<string[]> => {
  const interviews = await Interview.find({}, { _id: 1 });

  if (!interviews || interviews.length === 0) {
    throw new Error("No interviews found");
  }

  // Interview ID'lerini döndür
  return interviews.map((interview) => interview._id.toString());
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

  export const getPackageQuestionsByInterviewService = async (interviewId: string) => {
    // Interview'i bulma ve packageId'leri getirme
    const interview = await Interview.findById(interviewId).populate("packageId");
  
    if (!interview) {
      throw createHttpError(404, "Interview not found");
    }
  
    const pckgs = await Promise.all(
      interview?.packageId.map(async (pckgId) => {
        const pckg = await Package.findById(pckgId);
        return pckg;
      })
    );
    
    // Paketlerin sorularını düzenleme
    const packageQuestions = pckgs.map((pkg) => ({
      packageId: pkg?._id,
      questions: pkg?.questions,
    }));
  
    return {
      interviewId: interview._id,
      packages: packageQuestions,
    };
  };
  

  interface PaginatedPersonalForms {
    personalForms: Document[]; // PersonalInformationFormType olmadan Document tipini doğrudan kullanıyoruz
    totalCount: number;
  }
  
  export const getPersonalFormsByInterviewService = async (
    interviewId: string,
    page: number = 1,
    limit: number = 12
  ): Promise<PaginatedPersonalForms> => {
    try {
      // Interview'i bulma ve personalForms IDs listesini alma
      const interview = await Interview.findById(interviewId).select("personalInformationForms");
  
      if (!interview) {
        throw createHttpError(404, "Interview not found");
      }
  
      // Sayfalama için skip ve limit değerlerini hesaplama
      const skip = (page - 1) * limit;
      
      // personalForms listesindeki ID'lere göre PersonalInformationForm verisini çekiyoruz
      const personalForms = await PersonalInformationForm.find({
        _id: { $in: interview.personalInformationForms },
      })
        .skip(skip)
        .limit(limit);
  
      // Toplam aday sayısını Interview'deki personalForms IDs uzunluğundan alıyoruz
      const totalCount = interview.personalInformationForms.length;
  
      return { personalForms, totalCount };
    } catch (error) {
      console.error("Error fetching personal forms by interview:", error);
      throw error;
    }
  };

  export const getInterviewExpireDateService = async (interviewId: string) => {
    // Interview'i bulma
    const interview = await Interview.findById(interviewId);
  
    if (!interview) {
      throw createHttpError(404, "Interview not found");
    }
  
    // Interview bulunduysa, expireDate'i döndür
    return interview.expireDate;
  };

  