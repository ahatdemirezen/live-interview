"use strict";
// services/mediaService.ts
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
exports.deleteCandidateAndMediaService = exports.getMediaInfoService = exports.getVideoByIdService = exports.uploadMediaService = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const candidate_model_1 = __importDefault(require("../models/candidate-model"));
const http_errors_1 = __importDefault(require("http-errors"));
// Upload Media Service
const uploadMediaService = (file, formId, config) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!file) {
        throw (0, http_errors_1.default)(400, 'No media file provided');
    }
    // FormData oluşturulması
    const form = new form_data_1.default();
    form.append('file', file.buffer, file.originalname);
    form.append('bucket', config.BUCKET_NAME);
    form.append('project', config.Project);
    form.append('accessKey', config.AWS_SECRET_ACCESS_KEY);
    const response = yield axios_1.default.post(config.Link, form, {
        headers: Object.assign({}, form.getHeaders()),
    });
    const videoId = (_b = (_a = response.data.files) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.fileId;
    if (!videoId)
        throw new Error('Video ID not found in media service response');
    // Formu güncelleme: videoId'yi formun videoId alanına ekleyin
    const updatedForm = yield candidate_model_1.default.findByIdAndUpdate(formId, { videoId }, { new: true });
    if (!updatedForm)
        throw (0, http_errors_1.default)(404, 'Form not found');
    return updatedForm;
});
exports.uploadMediaService = uploadMediaService;
// Get Video By ID Service
const getVideoByIdService = (videoId, config) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const url = `${config.Link}/${config.Project}/${config.BUCKET_NAME}/${config.AWS_SECRET_ACCESS_KEY}/${videoId}`;
    const response = yield axios_1.default.get(url);
    const videoUrl = (_a = response.data) === null || _a === void 0 ? void 0 : _a.url;
    if (!videoUrl)
        throw (0, http_errors_1.default)(404, 'Video not found');
    return videoUrl;
});
exports.getVideoByIdService = getVideoByIdService;
// Get Media Info Service
const getMediaInfoService = (config) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${config.Link}/${config.Project}/${config.BUCKET_NAME}/${config.AWS_SECRET_ACCESS_KEY}`;
    const response = yield axios_1.default.get(url);
    return response.data;
});
exports.getMediaInfoService = getMediaInfoService;
// Delete Candidate and Media Service
const deleteCandidateAndMediaService = (formId, videoId, config) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Adayı Silme İşlemi
    const deletedForm = yield candidate_model_1.default.findByIdAndDelete(formId);
    if (!deletedForm)
        throw (0, http_errors_1.default)(404, 'Candidate form not found');
    // 2. Video Silme İşlemi (Video varsa)
    if (videoId) {
        const videoDeleteUrl = `${config.Link}/${config.Project}/${config.BUCKET_NAME}/${config.AWS_SECRET_ACCESS_KEY}/${videoId}`;
        try {
            const videoDeleteResponse = yield axios_1.default.delete(videoDeleteUrl);
            if (videoDeleteResponse.status !== 200 && videoDeleteResponse.status !== 204) {
                throw (0, http_errors_1.default)(500, 'Failed to delete media from external service');
            }
        }
        catch (error) {
            console.error("Video silme işlemi sırasında hata oluştu:", error);
            // Videoyu silme hatası adayın silinmesini engellemez
        }
    }
    return deletedForm;
});
exports.deleteCandidateAndMediaService = deleteCandidateAndMediaService;
