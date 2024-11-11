import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

// .env dosyasındaki verileri kullanabilmek için dotenv'i başlatıyoruz
dotenv.config();

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

      // Token'ı HTTP Only cookie olarak ekliyoruz
      res.cookie('token', token, {
        httpOnly: process.env.NODE_ENV == "production" ? true : false,
        secure: false, // Yalnızca HTTPS üzerinden gönderilsin
        maxAge: 60 * 60 * 1000, // Cookie süresi: 1 saat (3600000 milisaniye)
        sameSite: 'strict', // CSRF saldırılarına karşı koruma
      });
      

      // Başarılı giriş yanıtı
      res.status(200).json({
        message: "Login successful",
      });
    } else {
      throw createHttpError(401, "Invalid email or password");
    }
  } catch (error) {
    next(error); // Hata yakalama
  }
};


export const checkToken = async (req: Request, res: Response): Promise<any> => {
  try {
    const cookieToken = req.cookies.token;
    console.log("cookietoken" , cookieToken)
    if (!cookieToken) {
      return res.status(401).json({ message: "Token is missing or expired" });
    }
    
    const verifiedToken = jwt.verify(cookieToken, jwtSecret!);
    if (verifiedToken) {
      return res.status(200).json({ message: "Token is valid" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Token çerezini temizliyoruz
    res.clearCookie('token', {
      httpOnly: process.env.NODE_ENV == "production" ? true : false,
      secure: false,
      sameSite: 'strict',
    });

    // Başarılı çıkış yanıtı
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error); // Hata yakalama
  }
};
