import express, { Request, Response, NextFunction } from "express";
import connectDB from "./config/db";
import dotenv from "dotenv";
import cors from "cors";
import liveInterview from "./routes/interview-route";
import Package from "./routes/package-route";
import loginRoute from "./routes/login-route";
import { authenticateToken } from "./middleware/auth";
import cookieParser from "cookie-parser"; // Cookie-parser'ı import ediyoruz

dotenv.config();

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173', // Frontend URL'sini burada tanımlıyoruz geçici olarak.
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Credentials ile ilgili isteklere izin ver
  })
);


// Middleware: Cookie parsing
app.use(cookieParser()); // Cookie'leri okumak için ekliyoruz

// Middleware: JSON body parsing
app.use(express.json()); // JSON verileri alabilmek için

// Ana sayfa rotası
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Homepage!");
});

// API rotaları
app.use("/api/interview", authenticateToken, liveInterview);
app.use("/api/package", authenticateToken, Package);
app.use("/api/login", loginRoute);

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
