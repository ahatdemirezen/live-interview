import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

// .env dosyasındaki verileri kullanabilmek için dotenv'i başlatıyoruz
dotenv.config();

// Statik email ve şifreyi .env dosyasından alıyoruz
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    // Email ve şifreyi kontrol et
    if (email === adminEmail && password === adminPassword) {
      // Kullanıcı email doğrulandıktan sonra JWT token oluştur
      const token = jwt.sign(
        { email }, // Payload: kullanıcının email'ini payload olarak ekliyoruz
        jwtSecret!, // Secret key .env dosyasından alınıyor
        { expiresIn: jwtExpiresIn } // Token'ın geçerlilik süresi
      );

      // Başarılı giriş durumunda JWT token'ı döndür
      res.status(200).json({
        message: "Login successful",
        token, // Token'ı döndürüyoruz
      });
    } else {
      throw createHttpError(401, "Invalid email or password");
    }
  } catch (error) {
    next(error); // Hata yakalama
  }
};
