import { Request, Response, NextFunction } from "express";
import { createInterviewService, getInterviewsService, deleteInterviewService } from "../services/interview-service"; // Service'i import et

export const createInterview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { interviewTitle, expireDate, packageId } = req.body;

    // Service katmanını kullanarak interview oluştur
    const savedInterview = await createInterviewService(interviewTitle, expireDate, packageId);

    // Başarı durumunda yanıt döndür
    res.status(201).json(savedInterview);
  } catch (error) {
    // Hataları yakalayıp bir sonraki middleware'e ilet
    next(error);
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


export const deleteInterview = async (req: Request, res: Response, next: NextFunction) => {
  const { interviewId } = req.params;

  try {
    const deletedInterview = await deleteInterviewService(interviewId);
    res.status(200).json({ message: "Interview deleted successfully", deletedInterview });
  } catch (error) {
    next(error);
  }
};