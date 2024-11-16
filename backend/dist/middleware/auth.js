"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
// .env dosyasındaki verileri kullanabilmek için dotenv'i başlatıyoruz
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
const authenticateToken = (req, res, next) => {
    // Eğer Authorization başlığı yoksa cookie'den token'ı al
    const cookieToken = req.cookies.token;
    console.log("Cookie Token:", cookieToken); // Çerezdeki token'ı loglayın
    // Bearer token ya da cookie token yoksa hata döndür
    if (!cookieToken) {
        res.status(401).json({ message: "Invalid or expired token" });
        return;
    }
    console.log;
    // Bearer token ya da cookie token ile doğrulama yap
    const verifiedToken = jsonwebtoken_1.default.verify(cookieToken, jwtSecret || "");
    if (verifiedToken) {
        next();
    }
    else {
        res.status(401).json({ message: "Unauthorized request" });
        return;
    }
};
exports.authenticateToken = authenticateToken;
