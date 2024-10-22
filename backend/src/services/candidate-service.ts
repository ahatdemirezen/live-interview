import PersonalInformationForm from '../models/candidate-model';
import Interview from "../models/interview-model";
import mongoose from "mongoose";

// Tüm kişisel bilgileri getirme
export const getAllPersonalInfoService = async () => {
  return await PersonalInformationForm.find();
};

// Yeni kişisel bilgi ekleme
export const createPersonalInfoService = async (name: string, surname: string, email: string, phone: string, interviewId: string) => {
  // interviewId'nin geçerli bir ObjectId olup olmadığını kontrol et
  if (!mongoose.isValidObjectId(interviewId)) {
    throw new Error('Geçersiz Interview ID');
  }

  // Interview'ı bulalım
  const interview = await Interview.findById(interviewId);
  if (!interview) {
    throw new Error('Interview bulunamadı');
  }

  // Yeni kişisel bilgileri (adayı) ekle
  const newPersonalInfo = new PersonalInformationForm({
    name,
    surname,
    email,
    phone,
  });

  // Adayı kaydet
  const savedPersonalInfo = await newPersonalInfo.save();

  // Interview'a bu adayın ID'sini (personalInformationForms listesine) ekleyelim
  interview.personalInformationForms.push(savedPersonalInfo._id);
  await interview.save();

  return savedPersonalInfo;
};
// Service - Adayın mülakat statüsünü güncelleme
export const updatePersonalInfoStatusService = async (id: string, status: boolean) => {
  const personalInfo = await PersonalInformationForm.findById(id);

  if (!personalInfo) {
    throw new Error('Aday bulunamadı');
  }

  personalInfo.status = status; // Status alanını güncelliyoruz
  await personalInfo.save();

  return personalInfo;
};
