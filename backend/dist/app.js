"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const interview_route_1 = __importDefault(require("./routes/interview-route"));
const package_route_1 = __importDefault(require("./routes/package-route"));
const login_route_1 = __importDefault(require("./routes/login-route"));
const candidate_route_1 = __importDefault(require("./routes/candidate-route"));
const auth_1 = require("./middleware/auth");
const cookie_parser_1 = __importDefault(require("cookie-parser")); // Cookie-parser'ı import ediyoruz
const media_route_1 = __importDefault(require("./routes/media-route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Birden fazla frontend URL'sine izin veriyoruz
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Credentials ile ilgili isteklere izin ver
}));
// Middleware: JSON body parsing
app.use(express_1.default.json()); // JSON verileri alabilmek için
app.use((0, cookie_parser_1.default)()); // Cookie'leri kullanabilmek için cookie parser middleware'i kullan
// Ana sayfa rotası
app.get("/", (req, res) => {
    res.send("Welcome to the Homepage!");
});
// API rotaları
app.use("/api/interview", interview_route_1.default);
app.use("/api/package", auth_1.authenticateToken, package_route_1.default);
app.use("/api/login", login_route_1.default);
app.use("/api/candidate", candidate_route_1.default);
app.use("/api/upload", media_route_1.default); // Yeni eklenen route
// Hataları yakalayan middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Hatanın detaylarını konsola yazdır
    res.status(500).json({
        error: "Internal Server Error",
        message: err.message, // Hatanın mesajını kullanıcıya dönebiliriz
    });
});
// 404 hatalarını yakalayan middleware
app.use((req, res) => {
    res.status(404).json({
        error: "Not Found",
        message: "The requested resource was not found.",
    });
});
// Sunucuyu başlat
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default)();
    console.log(`Server is running on port ${PORT}`);
}));
