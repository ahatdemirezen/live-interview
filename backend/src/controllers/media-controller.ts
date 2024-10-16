import { Request, Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import * as dotenv from 'dotenv';

dotenv.config();  // .env dosyasındaki değerleri yüklüyoruz

export const uploadMedia = async (req: Request, res: Response): Promise<void> => {
  const { AWS_SECRET_ACCESS_KEY, BUCKET_NAME, Project, Link } = process.env;

  console.log("AWS_SECRET_ACCESS_KEY:", AWS_SECRET_ACCESS_KEY);
  console.log("BUCKET_NAME:", BUCKET_NAME);
  console.log("Project:", Project);
  console.log("Link:", Link);

  // İstek gövdesinden dosya alınması
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
    // Medya dosyasını .env'deki Link'e yükleme (axios ile POST isteği)
    const response = await axios.post(Link as string, form, {
      headers: {
        ...form.getHeaders(), // FormData ile ilgili başlıkları ekliyoruz
      },
    });

    // Başarılı yükleme durumunda client'e geri dönüş
    res.status(200).json({
      message: 'Media successfully uploaded to external service',
      data: response.data, // Harici servisten gelen yanıt
    });
  } catch (error) {
    // Hata durumunda error değişkenini Error tipine dönüştürme
    if (axios.isAxiosError(error)) {
        console.error('Error uploading media to external service:', error.response?.data || error.message);
        res.status(500).json({
          message: 'Media upload to external service failed',
          error: error.response?.data || error.message,
        });
    } else {
        console.error('Unknown error uploading media to external service:', error);
        res.status(500).json({
          message: 'An unknown error occurred',
        });
    }
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
