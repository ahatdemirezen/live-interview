import { Request, Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import * as dotenv from 'dotenv';
import PersonalInformationForm from '../models/candidate-model'; // Form modelini import ediyoruz

dotenv.config();  // .env dosyasındaki değerleri yüklüyoruz

export const uploadMedia = async (req: Request, res: Response): Promise<void> => {
  const { AWS_SECRET_ACCESS_KEY, BUCKET_NAME, Project, Link } = process.env;
  const { formId } = req.params;  // URL'den formId'yi alıyoruz

  const mediaFile = req.file; // 'file' alanı adıyla gelen dosyayı alıyoruz

  if (!mediaFile) {
    res.status(400).json({ error: 'No media file provided.' });
    return;
  }

  // FormData oluşturulması
  const form = new FormData();
  form.append('file', mediaFile.buffer, mediaFile.originalname); // Dosyayı ekliyoruz
  form.append('bucket', BUCKET_NAME as string); // .env'den gelen BUCKET_NAME
  form.append('project', Project as string); // .env'den gelen Project adı
  form.append('accessKey', AWS_SECRET_ACCESS_KEY as string); // .env'den gelen secret key

  try {
    // Medya dosyasını harici servise yükleme
    const response = await axios.post(Link as string, form, {
      headers: {
        ...form.getHeaders(),
      },
    });
  
    console.log("Response from media service:", response.data);
  
    // Harici medya servisinden dönen ID'yi alın (dosya listesi içindeki fileId'den)
    const videoId = response.data.files?.[0]?.fileId;  // Dönüş verisinden videoId alın

    console.log("Extracted videoId:", videoId);
  
    if (!videoId) {
      throw new Error('Video ID not found in media service response.');
    }
  
    // Formu güncelleme: videoId'yi formun videoId alanına ekleyin
    const updatedForm = await PersonalInformationForm.findByIdAndUpdate(
      formId,
      { videoId: videoId },  // videoId alanını güncelleme
      { new: true }
    );
  
    if (!updatedForm) {
      res.status(404).json({ message: 'Form not found' });
      return;
    }
  
    // Başarılı yükleme durumunda geri dön
    res.status(200).json({
      message: 'Media successfully uploaded and form updated with videoId',
      updatedForm,
    });
  
  } catch (error: any) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'An error occurred during media upload or form update',
      error: error.message, // error'ın mesajına güvenebilirsiniz
    });
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


export const getMediaInfo = async (req: Request, res: Response): Promise<void> => {
  const { AWS_SECRET_ACCESS_KEY, BUCKET_NAME, Project, Link } = process.env;

  // Dinamik URL oluşturulması
  const url = `${Link}/${Project}/${BUCKET_NAME}/${AWS_SECRET_ACCESS_KEY}`;

  console.log("GET Request URL:", url);

  try {
    // GET isteği gönderiyoruz
    const response = await axios.get(url);

    // Başarılı istek durumunda client'e geri dönüş
    res.status(200).json({
      message: 'GET request to external service was successful',
      data: response.data, // Harici servisten gelen yanıt
    });
  } catch (error) {
    // Hata durumunda error değişkenini Error tipine dönüştürme
    if (axios.isAxiosError(error)) {
      console.error('Error making GET request to external service:', error.response?.data || error.message);
      res.status(500).json({
        message: 'GET request to external service failed',
        error: error.response?.data || error.message,
      });
    } else {
      console.error('Unknown error making GET request to external service:', error);
      res.status(500).json({
        message: 'An unknown error occurred during GET request',
      });
    }
  }
};

export const deleteCandidateAndMedia = async (req: Request, res: Response): Promise<void> => {
  const { AWS_SECRET_ACCESS_KEY, BUCKET_NAME, Project, Link } = process.env;
  const { formId, videoId } = req.body;  // Body'den formId ve videoId'yi alıyoruz

  if (!formId || !videoId) {
    res.status(400).json({ message: 'Both formId and videoId are required' });
    return;
  }

  try {
    // 1. Adayı Silme İşlemi
    const deletedForm = await PersonalInformationForm.findByIdAndDelete(formId);

    if (!deletedForm) {
      res.status(404).json({ message: 'Candidate form not found' });
      return;
    }

    // 2. Video Silme İşlemi
    const videoDeleteUrl = `${Link}/${Project}/${BUCKET_NAME}/${AWS_SECRET_ACCESS_KEY}/${videoId}`;

    // Harici medya servisinde videoyu silme
    const videoDeleteResponse = await axios.delete(videoDeleteUrl);

    if (videoDeleteResponse.status === 200 || videoDeleteResponse.status === 204) {
      res.status(200).json({
        message: 'Candidate form and associated media deleted successfully',
        deletedForm,
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to delete media from external service',
        error: videoDeleteResponse.data 
      });
    }
  } catch (error) {
    console.error('Error deleting candidate or media:', error);
    if (axios.isAxiosError(error)) {
      res.status(500).json({
        message: 'Error during delete request to external service',
        error: error.response?.data || error.message,
      });
    } else {
      res.status(500).json({
        message: 'An unknown error occurred during deletion',
      });
    }
  }
};