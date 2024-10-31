import { Request, Response, NextFunction } from "express";
import { createInterviewService, getInterviewsService, deleteInterviewService , fetchInterviewIds , getInterviewExpireDateService , getInterviewSettingsService , getPersonalFormsByInterviewService, getPackageQuestionsByInterviewService } from "../services/interview-service"; // Service'i import et

export const createInterview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { interviewTitle, expireDate, packageIds, canSkip = false, showAtOnce = false } = req.body;

    // Service katmanını kullanarak interview oluştur
    const savedInterview = await createInterviewService(interviewTitle, expireDate, packageIds, canSkip, showAtOnce);

    // Başarı durumunda yanıt döndür
    res.status(201).json(savedInterview);
  } catch (error) {
    // Hataları yakalayıp bir sonraki middleware'e ilet
    next(error);
  }
};


export const getPackageQuestionsByInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { interviewId } = req.params;

    // Service fonksiyonunu çağırıyoruz
    const result = await getPackageQuestionsByInterviewService(interviewId);

    // Başarı yanıtı döndürme
    res.status(200).json(result);
  } catch (error) {
    next(error); // Hataları middleware'e yönlendiriyoruz
  }
};
export const getPersonalFormsByInterview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { interviewId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;

    // Service fonksiyonunu çağırıyoruz
    const { personalForms, totalCount } = await getPersonalFormsByInterviewService(interviewId, page, limit);

    // Başarı yanıtı döndürme
    res.status(200).json({
      personalInformationForms: personalForms,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error); // Hataları middleware'e yönlendiriyoruz
  }
};



export const getInterviewExpireDate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { interviewId } = req.params;

    // Service fonksiyonunu çağırarak expire date'i alıyoruz
    const expireDate = await getInterviewExpireDateService(interviewId);

    // Başarı yanıtı döndürme
    res.status(200).json({ expireDate });
  } catch (error) {
    next(error); // Hataları middleware'e yönlendiriyoruz
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
    // Servis katmanından interview ID'lerini al
    const interviewIds = await fetchInterviewIds();
    
    // Yanıt olarak interview ID'lerini gönder
    res.status(200).json(interviewIds);
  } catch (error) {
    next(error); // Hata işleme
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

export const getInterviewSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { interviewId } = req.params;

    const interviewSettings = await getInterviewSettingsService(interviewId);

    res.status(200).json(interviewSettings);
  } catch (error) {
    next(error);
  }
};