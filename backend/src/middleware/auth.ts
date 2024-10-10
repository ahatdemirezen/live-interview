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
  // Authorization başlığından Bearer Token'ı alıyoruz
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token> formatında olduğu için 'Bearer' kısmını atıyoruz

  // Eğer Authorization başlığı yoksa cookie'den token'ı al
  const cookieToken = req.cookies.token;

  // Bearer token ya da cookie token yoksa hata döndür
  if (!token && !cookieToken) {
    return next(createHttpError(403, "No token provided"));
  }

  // Bearer token ya da cookie token ile doğrulama yap
  jwt.verify(token || cookieToken, jwtSecret!, (err: jwt.VerifyErrors | null, user: string | JwtPayload | undefined) => {
    if (err) {
      return next(createHttpError(403, "Invalid token"));
    }

    // Token geçerliyse kullanıcıyı request'e ekliyoruz
    req.user = user;
    next(); // Bir sonraki middleware veya route handler'a geçiş
  });
};
