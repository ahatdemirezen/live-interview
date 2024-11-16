import express, { Request, Response, NextFunction } from "express";
import connectDB from "./config/db";
import dotenv from "dotenv";
import cors from "cors";
import liveInterview from "./routes/interview-route";
import Package from "./routes/package-route";
import loginRoute from "./routes/login-route";
import candidate from "./routes/candidate-route"
import { authenticateToken } from "./middleware/auth";
import cookieParser from "cookie-parser"; // Cookie-parser'ı import ediyoruz
import media from "./routes/media-route"

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "https://live-interview-delta.vercel.app",],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Credentials ile ilgili isteklere izin ver
  })
);


// Middleware: JSON body parsing
app.use(express.json()); // JSON verileri alabilmek için
app.use(cookieParser()); // Cookie'leri kullanabilmek için cookie parser middleware'i kullan

// Ana sayfa rotası
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Homepage!");
});

// API rotaları
app.use("/api/interview", liveInterview);
app.use("/api/package",  authenticateToken, Package);
app.use("/api/login", loginRoute);
app.use("/api/candidate", candidate);
app.use("/api/upload", media); // Yeni eklenen route

// Hataları yakalayan middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Hatanın detaylarını konsola yazdır
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message, // Hatanın mesajını kullanıcıya dönebiliriz
  });
});

// 404 hatalarını yakalayan middleware
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource was not found.",
  });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5002;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});
