import { Request, Response } from 'express';
import PersonalInformationForm from '../models/candidate-model';

// GET - Tüm kişisel bilgileri getirme
export const getAllPersonalInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const personalInfos = await PersonalInformationForm.find();
    res.status(200).json(personalInfos);
  } catch (error) {
    res.status(500).json({ message: 'Verileri getirirken bir hata oluştu', error });
  }
};

// POST - Yeni kişisel bilgileri ekleme
export const createPersonalInfo = async (req: Request, res: Response): Promise<void> => {
  const { name, surname, email, phone } = req.body;

  try {
    const newPersonalInfo = new PersonalInformationForm({
      name,
      surname,
      email,
      phone,
    });

    await newPersonalInfo.save();
    res.status(201).json(newPersonalInfo);
  } catch (error) {
    res.status(500).json({ message: 'Bilgiler kaydedilirken bir hata oluştu', error });
  }
};
