"use strict";
// controllers/mediaController.ts
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
exports.deleteCandidateAndMedia = exports.getMediaInfo = exports.getVideoById = exports.uploadMedia = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
const media_service_1 = require("../services/media-service");
dotenv.config(); // .env dosyasındaki değerleri yüklüyoruz
const config = {
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    BUCKET_NAME: process.env.BUCKET_NAME,
    Project: process.env.Project,
    Link: process.env.Link,
};
const uploadMedia = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { formId } = req.params;
    const mediaFile = req.file;
    // Eğer mediaFile undefined ise hata döndür
    if (!mediaFile) {
        res.status(400).json({ error: 'No media file provided.' });
        return;
    }
    try {
        const updatedForm = yield (0, media_service_1.uploadMediaService)(mediaFile, formId, config);
        res.status(200).json({
            message: 'Media successfully uploaded and form updated with videoId',
            updatedForm,
        });
    }
    catch (error) {
        next(error); // Hataları next ile aktar
    }
});
exports.uploadMedia = uploadMedia;
const getVideoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { videoId } = req.body; // Body'den videoId alıyoruz
    const { AWS_SECRET_ACCESS_KEY, BUCKET_NAME, Project, Link } = process.env;
    if (!videoId) {
        res.status(400).json({ message: 'No videoId provided' });
        return; // `void` döndürmek için `return` eklenmesi
    }
    try {
        // videoId'ye göre video bilgilerini almak için .env'den aldığımız Link'i kullanıyoruz
        const response = yield axios_1.default.get(`${Link}/${Project}/${BUCKET_NAME}/${AWS_SECRET_ACCESS_KEY}/${videoId}`); // Medya servisinden video URL'sini alıyoruz
        // Yanıt yapısında video URL'sini içeren veri doğru mu kontrol edin
        const videoUrl = (_a = response.data) === null || _a === void 0 ? void 0 : _a.url; // Eğer yanıt 'url' alanını içeriyorsa alın
        if (!videoUrl) {
            res.status(404).json({ message: 'Video not found' });
            return;
        }
        // Başarılı yanıt durumunda video URL'sini döndürün
        res.status(200).json({
            message: 'Video URL fetched successfully',
            videoUrl,
        });
        return; // `void` döndürmek için `return` eklenmesi
    }
    catch (error) {
        console.error('Error fetching video URL:', error);
        res.status(500).json({ message: 'Error fetching video URL', error });
        return; // `void` döndürmek için `return` eklenmesi
    }
});
exports.getVideoById = getVideoById;
const getMediaInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mediaInfo = yield (0, media_service_1.getMediaInfoService)(config);
        res.status(200).json({
            message: 'GET request to external service was successful',
            data: mediaInfo,
        });
    }
    catch (error) {
        next(error); // Hataları next ile aktar
    }
});
exports.getMediaInfo = getMediaInfo;
const deleteCandidateAndMedia = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { formId, videoId } = req.body;
    if (!formId) {
        res.status(400).json({ message: 'Both formId and videoId are required' });
        return;
    }
    try {
        const deletedForm = yield (0, media_service_1.deleteCandidateAndMediaService)(formId, videoId, config);
        res.status(200).json({
            message: 'Candidate form and associated media deleted successfully',
            deletedForm,
        });
    }
    catch (error) {
        next(error); // Hataları next ile aktar
    }
});
exports.deleteCandidateAndMedia = deleteCandidateAndMedia;
