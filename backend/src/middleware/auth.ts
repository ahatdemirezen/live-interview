import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as dotenv from "dotenv";
import createHttpError from "http-errors";
// .env dosyasındaki verileri kullanabilmek için dotenv'i başlatıyoruz
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
// Request tipini genişletiyoruz
interface CustomRequest extends Request {
  user?: string | JwtPayload;
}
export const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  // Eğer Authorization başlığı yoksa cookie'den token'ı al
  const cookieToken = req.cookies.token;
  console.log("Cookie Token:", cookieToken); // Çerezdeki token'ı loglayın
  // Bearer token ya da cookie token yoksa hata döndür
  if (!cookieToken) {
    return next(createHttpError(403, "No token provided"));
  }
  console.log
  // Bearer token ya da cookie token ile doğrulama yap
  const verifiedToken: any = jwt.verify(cookieToken, jwtSecret || "")
  
  if (verifiedToken) {
    next()
  } else {
    return next(createHttpError(403, "Token not verified"));
  }
};