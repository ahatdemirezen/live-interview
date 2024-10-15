import { Request, Response, NextFunction } from 'express';
import { getAllPersonalInfoService, createPersonalInfoService } from '../services/candidate-service';

// GET - Tüm kişisel bilgileri getirme
export const getAllPersonalInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const personalInfos = await getAllPersonalInfoService();
    res.status(200).json(personalInfos);
  } catch (error) {
    res.status(500).json({ message: 'Verileri getirirken bir hata oluştu', error });
  }
};

// POST - Yeni kişisel bilgileri ekleme
export const createPersonalInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, surname, email, phone } = req.body;
  const { interviewId } = req.params; // URL'den interviewId alıyoruz

  try {
    const savedPersonalInfo = await createPersonalInfoService(name, surname, email, phone, interviewId);
    res.status(201).json(savedPersonalInfo);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Geçersiz Interview ID') {
        res.status(400).json({ message: error.message });
      } else if (error.message === 'Interview bulunamadı') {
        res.status(404).json({ message: error.message });
      } else {
        next(error);  // Diğer hatalarda bir sonraki middleware'e geç
      }
    } else {
      next(error); // error, Error tipi değilse, yine de bir sonraki middleware'e geç
    }
  }
};