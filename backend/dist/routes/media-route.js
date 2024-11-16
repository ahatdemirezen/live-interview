"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const media_controller_1 = require("../controllers/media-controller");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)(); // Multer'ı kullanarak dosya yüklemeyi tanımlıyoruz
// POST isteği: Dosya alanı 'file' olarak tanımlı
router.post('/media/:formId', upload.single('file'), media_controller_1.uploadMedia);
router.get('/media-info', media_controller_1.getMediaInfo); // GET isteğiyle medya bilgilerini alma
router.post('/video-url', media_controller_1.getVideoById);
router.delete('/delete-candidate-media', media_controller_1.deleteCandidateAndMedia);
exports.default = router;
