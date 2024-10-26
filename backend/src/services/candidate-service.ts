import PersonalInformationForm from '../models/candidate-model';
import Interview from "../models/interview-model";
import mongoose from "mongoose";
import createHttpError from "http-errors";

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

export const updateCandidateStatusService = async (formId: string, status: string) => {
  // Geçerli statü değerlerini kontrol ediyoruz
  const validStatuses = ['pending', 'passed', 'failed'];
  if (!validStatuses.includes(status)) {
    throw createHttpError(400, 'Geçersiz statü değeri');
  }

  // Formu güncelleme işlemi
  const updatedForm = await PersonalInformationForm.findByIdAndUpdate(
    formId,
    { status },
    { new: true }
  );

  if (!updatedForm) {
    throw createHttpError(404, 'Candidate form not found');
  }

  return updatedForm;
};
export const updateCandidateNoteService = async (formId: string, note: string) => {
  // Formu güncelleme işlemi
  const updatedCandidate = await PersonalInformationForm.findByIdAndUpdate(
    formId,
    { note },
    { new: true } // Güncellenmiş belgeyi döndür
  );

  if (!updatedCandidate) {
    throw createHttpError(404, "Aday bulunamadı");
  }

  return updatedCandidate;
};