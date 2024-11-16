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
exports.logoutUser = exports.refreshAccessToken = exports.createUser = void 0;
const dotenv = __importStar(require("dotenv"));
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// .env dosyasındaki verileri kullanabilmek için dotenv'i başlatıyoruz
dotenv.config();
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = '2m'; // Access token süresi 2 dakika
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET; // Refresh token için ayrı bir secret
const jwtRefreshExpiresIn = '1d'; // Refresh token süresi 1 gün
// Access token oluşturma
const createAccessToken = (email) => {
    return jsonwebtoken_1.default.sign({ email }, jwtSecret, { expiresIn: jwtExpiresIn });
};
// Refresh token oluşturma
const createRefreshToken = (email) => {
    return jsonwebtoken_1.default.sign({ email }, jwtRefreshSecret, // Refresh token için farklı bir secret
    { expiresIn: jwtRefreshExpiresIn } // Refresh token 7 gün geçerli olabilir
    );
};
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (email === adminEmail && password === adminPassword) {
            // Access token ve refresh token oluştur
            const accessToken = createAccessToken(email);
            const refreshToken = createRefreshToken(email);
            // Access token'ı HTTP-Only cookie olarak ekliyoruz
            res.cookie('token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV == "production" ? true : false,
                maxAge: 2 * 60 * 1000, // 2 dakika
                sameSite: 'strict',
            });
            // Refresh token'ı başka bir HTTP-Only cookie olarak ekliyoruz
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV == "production" ? true : false,
                maxAge: 24 * 60 * 60 * 1000, // 1 gün
                sameSite: 'strict',
            });
            res.status(200).json({
                message: "Login successful",
            });
        }
        else {
            throw (0, http_errors_1.default)(401, "Invalid email or password");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.createUser = createUser;
const refreshAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }
    try {
        // Refresh token doğrulama
        const payload = jsonwebtoken_1.default.verify(refreshToken, jwtRefreshSecret);
        // Yeni access token oluşturma
        const newAccessToken = createAccessToken(payload.email);
        // Yeni access token'ı HTTP-Only cookie olarak ekliyoruz
        res.cookie('token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production" ? true : false,
            maxAge: 2 * 60 * 1000, // 2 dakika
            sameSite: 'strict',
        });
        res.status(200).json({ message: "Access token refreshed successfully" });
    }
    catch (error) {
        next(error); // Hata durumunda next ile Express'e hatayı bildiriyoruz
    }
});
exports.refreshAccessToken = refreshAccessToken;
const logoutUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Access token ve refresh token çerezlerini temizliyoruz
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production" ? true : false,
            sameSite: 'strict',
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production" ? true : false,
            sameSite: 'strict',
        });
        res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        next(error);
    }
});
exports.logoutUser = logoutUser;
