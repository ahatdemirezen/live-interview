import express from "express"
import connectDB from "./config/db";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
dotenv.config();
connectDB();

app.use(
  cors({
    origin: "*", // Bu geçici olarak tüm kaynaklara izin verir. Güvenlik açısından gerçek ortamda uygun bir URL belirtin.
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.get("/", (req, res) => {
  res.send("Welcome to the Homepage!");
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});