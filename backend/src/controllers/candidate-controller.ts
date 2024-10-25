import { Request, Response, NextFunction } from 'express';
import { getAllPersonalInfoService, createPersonalInfoService ,updatePersonalInfoStatusService } from '../services/candidate-service';
import PersonalInformationForm from "../models/candidate-model";

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

// Adayın status durumunu güncelleyen endpoint (formId'yi body'den alıyoruz)
export const updateCandidateStatus = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { formId, status } = req.body;

  // Geçerli statü değerlerini kontrol edelim
  const validStatuses = ['pending', 'passed', 'failed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Geçersiz statü değeri' });
  }

  try {
    const updatedForm = await PersonalInformationForm.findByIdAndUpdate(
      formId,
      { status },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: 'Candidate form not found' });
    }

    return res.status(200).json({ message: 'Candidate status updated', updatedForm });
  } catch (error) {
    next(error);
  }
};