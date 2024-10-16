import { Request, Response, NextFunction } from "express";
import { createInterviewService, getInterviewsService, deleteInterviewService } from "../services/interview-service"; // Service'i import et
import Package from "../models/package-model"; // Package şemasını import et
import Interview from "../models/interview-model";

export const createInterview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { interviewTitle, expireDate, packageIds } = req.body; // packageId değil packageIds array olarak aldık

    // Service katmanını kullanarak interview oluştur
    const savedInterview = await createInterviewService(interviewTitle, expireDate, packageIds);

    // Başarı durumunda yanıt döndür
    res.status(201).json(savedInterview);
  } catch (error) {
    // Hataları yakalayıp bir sonraki middleware'e ilet
    next(error);
  }
};

export const getPackageQuestionsByInterview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId).populate("packageId");

    if (!interview) {
      res.status(404).json({ message: "Interview not found" });
      return;
    }

    const packages = await Package.find({
      _id: { $in: interview.packageId },
    });

    const packageQuestions = packages.map((pkg) => ({
      packageId: pkg._id,
      questions: pkg.questions,
    }));

    res.status(200).json({
      interviewId: interview._id,
      packages: packageQuestions,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching package questions", error });
  }
};

export const getInterviewExpireDate = async (req: Request, res: Response, next: NextFunction) => {
  const { interviewId } = req.params;

  try {
    // Interview id'ye göre veritabanından interview'u buluyoruz
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      res.status(404).json({ message: "Interview not found" });
      return;
    }

    // Interview bulundu, expireDate'i yanıt olarak döndürüyoruz
    res.status(200).json({ expireDate: interview.expireDate });
  } catch (error) {
    next(error); // Eğer bir hata olursa, hata middleware'ine iletilir
  }
};

export const getInterviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Service katmanını kullanarak interview'ları al
    const interviews = await getInterviewsService();
    res.status(200).json(interviews); // Başarı durumunda yanıt olarak tüm interview'ları döndür
  } catch (error) {
    // Hataları yakalayıp bir sonraki middleware'e ilet
    next(error);
  }
};


export const getInterviewIds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Interview modelinden sadece interviewId'leri (sadece _id alanını) alır
    const interviews = await Interview.find({}, { _id: 1 });

    // Eğer hiçbir interview bulunamadıysa
    if (!interviews || interviews.length === 0) {
      res.status(404).json({ message: "No interviews found" });
      return;
    }

     // Interview id'lerini döndür
    const interviewIds = interviews.map((interview) => interview._id);
    
    res.status(200).json(interviewIds);
  } catch (error) {
    next(error);
  }
};


export const deleteInterview = async (req: Request, res: Response, next: NextFunction) => {
  const { interviewId } = req.params;

  try {
    const deletedInterview = await deleteInterviewService(interviewId);
    res.status(200).json({ message: "Interview deleted successfully", deletedInterview });
  } catch (error) {
    next(error);
  }
};