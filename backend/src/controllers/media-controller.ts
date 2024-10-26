// controllers/mediaController.ts

import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

import * as dotenv from 'dotenv';
import {
  uploadMediaService,
  getMediaInfoService,
  deleteCandidateAndMediaService,
} from '../services/media-service';

dotenv.config();  // .env dosyasındaki değerleri yüklüyoruz

const config = {
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  BUCKET_NAME: process.env.BUCKET_NAME,
  Project: process.env.Project,
  Link: process.env.Link,
};

export const uploadMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { formId } = req.params;
  const mediaFile = req.file;

  // Eğer mediaFile undefined ise hata döndür
  if (!mediaFile) {
    res.status(400).json({ error: 'No media file provided.' });
    return;
  }

  try {
    const updatedForm = await uploadMediaService(mediaFile, formId, config);
    res.status(200).json({
      message: 'Media successfully uploaded and form updated with videoId',
      updatedForm,
    });
  } catch (error) {
    next(error); // Hataları next ile aktar
  }
};


export const getVideoById = async (req: Request, res: Response): Promise<void> => {
  const { videoId } = req.body; // Body'den videoId alıyoruz
  const { AWS_SECRET_ACCESS_KEY, BUCKET_NAME, Project, Link} = process.env;

  if (!videoId) {
    res.status(400).json({ message: 'No videoId provided' });
    return; // `void` döndürmek için `return` eklenmesi
  }

  try {
    // videoId'ye göre video bilgilerini almak için .env'den aldığımız Link'i kullanıyoruz
    const response = await axios.get(`${Link}/${Project}/${BUCKET_NAME}/${AWS_SECRET_ACCESS_KEY}/${videoId}`); // Medya servisinden video URL'sini alıyoruz
    // Yanıt yapısında video URL'sini içeren veri doğru mu kontrol edin
    const videoUrl = response.data?.url; // Eğer yanıt 'url' alanını içeriyorsa alın
    if (!videoUrl) {
      res.status(404).json({ message: 'Video not found' });
      return;
    }

    // Başarılı yanıt durumunda video URL'sini döndürün
    res.status(200).json({
      message: 'Video URL fetched successfully',
      videoUrl,
    });
    return; // `void` döndürmek için `return` eklenmesi
  } catch (error) {
    console.error('Error fetching video URL:', error);
    res.status(500).json({ message: 'Error fetching video URL', error });
    return; // `void` döndürmek için `return` eklenmesi
  }
};

export const getMediaInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const mediaInfo = await getMediaInfoService(config);
    res.status(200).json({
      message: 'GET request to external service was successful',
      data: mediaInfo,
    });
  } catch (error) {
    next(error);  // Hataları next ile aktar
  }
};

export const deleteCandidateAndMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { formId, videoId } = req.body;

  if (!formId || !videoId) {
    res.status(400).json({ message: 'Both formId and videoId are required' });
    return;
  }

  try {
    const deletedForm = await deleteCandidateAndMediaService(formId, videoId, config);
    res.status(200).json({
      message: 'Candidate form and associated media deleted successfully',
      deletedForm,
    });
  } catch (error) {
    next(error);  // Hataları next ile aktar
  }
};
