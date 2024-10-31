// services/mediaService.ts

import axios from 'axios';
import FormData from 'form-data';
import PersonalInformationForm from '../models/candidate-model';
import createHttpError from 'http-errors';

// Upload Media Service
export const uploadMediaService = async (file: Express.Multer.File, formId: string, config: any) => {
  if (!file) {
    throw createHttpError(400, 'No media file provided');
  }

  // FormData oluşturulması
  const form = new FormData();
  form.append('file', file.buffer, file.originalname);
  form.append('bucket', config.BUCKET_NAME);
  form.append('project', config.Project);
  form.append('accessKey', config.AWS_SECRET_ACCESS_KEY);

  const response = await axios.post(config.Link, form, {
    headers: { ...form.getHeaders() },
  });

  const videoId = response.data.files?.[0]?.fileId;
  if (!videoId) throw new Error('Video ID not found in media service response');

  // Formu güncelleme: videoId'yi formun videoId alanına ekleyin
  const updatedForm = await PersonalInformationForm.findByIdAndUpdate(formId, { videoId }, { new: true });
  if (!updatedForm) throw createHttpError(404, 'Form not found');

  return updatedForm;
};

// Get Video By ID Service
export const getVideoByIdService = async (videoId: string, config: any) => {
  const url = `${config.Link}/${config.Project}/${config.BUCKET_NAME}/${config.AWS_SECRET_ACCESS_KEY}/${videoId}`;
  const response = await axios.get(url);

  const videoUrl = response.data?.url;
  if (!videoUrl) throw createHttpError(404, 'Video not found');
  return videoUrl;
};

// Get Media Info Service
export const getMediaInfoService = async (config: any) => {
  const url = `${config.Link}/${config.Project}/${config.BUCKET_NAME}/${config.AWS_SECRET_ACCESS_KEY}`;
  const response = await axios.get(url);

  return response.data;
};

// Delete Candidate and Media Service
export const deleteCandidateAndMediaService = async (formId: string, videoId: string | null, config: any) => {
  // 1. Adayı Silme İşlemi
  const deletedForm = await PersonalInformationForm.findByIdAndDelete(formId);
  if (!deletedForm) throw createHttpError(404, 'Candidate form not found');

  // 2. Video Silme İşlemi (Video varsa)
  if (videoId) {
    const videoDeleteUrl = `${config.Link}/${config.Project}/${config.BUCKET_NAME}/${config.AWS_SECRET_ACCESS_KEY}/${videoId}`;
    try {
      const videoDeleteResponse = await axios.delete(videoDeleteUrl);
      if (videoDeleteResponse.status !== 200 && videoDeleteResponse.status !== 204) {
        throw createHttpError(500, 'Failed to delete media from external service');
      }
    } catch (error) {
      console.error("Video silme işlemi sırasında hata oluştu:", error);
      // Videoyu silme hatası adayın silinmesini engellemez
    }
  }

  return deletedForm;
};
