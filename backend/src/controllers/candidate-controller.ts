import { Request, Response, NextFunction } from 'express';
import { getAllPersonalInfoService, createPersonalInfoService , updateCandidateStatusService ,updateCandidateNoteService  } from '../services/candidate-service';
import PersonalInformationForm from '../models/candidate-model';

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

  try {
    // Service fonksiyonunu çağırıyoruz
    const updatedForm = await updateCandidateStatusService(formId, status);
    
    // Başarı yanıtı döndürme
    return res.status(200).json({ message: 'Candidate status updated', updatedForm });
  } catch (error) {
    next(error); // Hataları middleware'e gönderiyoruz
  }
};

export const updateCandidateNote = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { formId } = req.params; // Güncellenecek adayın formId'si
  const { note } = req.body; // Gönderilen not değeri

  try {
    // Service fonksiyonunu çağırıyoruz
    const updatedCandidate = await updateCandidateNoteService(formId, note);

    // Başarı yanıtı döndürme
    res.status(200).json(updatedCandidate);
  } catch (error) {
    next(error); // Hataları middleware'e yönlendiriyoruz
  }
};

// Kullanıcı uyarı durumunu güncelleme
export const updateUserAlert = async (req: Request, res: Response): Promise<void>  => {
  const { formId } = req.params;
  const { alert } = req.body;
  try {
    // Veritabanında kullanıcıyı bul ve alert alanını güncelle
    const updatedUser = await PersonalInformationForm.findByIdAndUpdate(
      formId,
      { alert: alert },
      { new: true } // Güncellenmiş kullanıcıyı döndür
    );
    if (!updatedUser) {
       res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Alert status updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating alert status:', error);
    res.status(500).json({ message: 'Error updating alert status', error });
  }
};