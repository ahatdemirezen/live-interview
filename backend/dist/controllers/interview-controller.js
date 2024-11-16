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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInterview = exports.getInterviewSettings = exports.deleteInterview = exports.getInterviewIds = exports.getInterviews = exports.getInterviewExpireDate = exports.getPersonalFormsByInterview = exports.getPackageQuestionsByInterview = exports.createInterview = void 0;
const interview_service_1 = require("../services/interview-service"); // Service'i import et
const createInterview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { interviewTitle, expireDate, packageIds, canSkip = false, showAtOnce = false } = req.body;
        // Service katmanını kullanarak interview oluştur
        const savedInterview = yield (0, interview_service_1.createInterviewService)(interviewTitle, expireDate, packageIds, canSkip, showAtOnce);
        // Başarı durumunda yanıt döndür
        res.status(201).json(savedInterview);
    }
    catch (error) {
        // Hataları yakalayıp bir sonraki middleware'e ilet
        next(error);
    }
});
exports.createInterview = createInterview;
const getPackageQuestionsByInterview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { interviewId } = req.params;
        // Service fonksiyonunu çağırıyoruz
        const result = yield (0, interview_service_1.getPackageQuestionsByInterviewService)(interviewId);
        // Başarı yanıtı döndürme
        res.status(200).json(result);
    }
    catch (error) {
        next(error); // Hataları middleware'e yönlendiriyoruz
    }
});
exports.getPackageQuestionsByInterview = getPackageQuestionsByInterview;
const getPersonalFormsByInterview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { interviewId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        // Service fonksiyonunu çağırıyoruz
        const { personalForms, totalCount } = yield (0, interview_service_1.getPersonalFormsByInterviewService)(interviewId, page, limit);
        // Başarı yanıtı döndürme
        res.status(200).json({
            personalInformationForms: personalForms,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
        });
    }
    catch (error) {
        next(error); // Hataları middleware'e yönlendiriyoruz
    }
});
exports.getPersonalFormsByInterview = getPersonalFormsByInterview;
const getInterviewExpireDate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { interviewId } = req.params;
        // Service fonksiyonunu çağırarak expire date'i alıyoruz
        const expireDate = yield (0, interview_service_1.getInterviewExpireDateService)(interviewId);
        // Başarı yanıtı döndürme
        res.status(200).json({ expireDate });
    }
    catch (error) {
        next(error); // Hataları middleware'e yönlendiriyoruz
    }
});
exports.getInterviewExpireDate = getInterviewExpireDate;
const getInterviews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Service katmanını kullanarak interview'ları al
        const interviews = yield (0, interview_service_1.getInterviewsService)();
        res.status(200).json(interviews); // Başarı durumunda yanıt olarak tüm interview'ları döndür
    }
    catch (error) {
        // Hataları yakalayıp bir sonraki middleware'e ilet
        next(error);
    }
});
exports.getInterviews = getInterviews;
const getInterviewIds = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Servis katmanından interview ID'lerini al
        const interviewIds = yield (0, interview_service_1.fetchInterviewIds)();
        // Yanıt olarak interview ID'lerini gönder
        res.status(200).json(interviewIds);
    }
    catch (error) {
        next(error); // Hata işleme
    }
});
exports.getInterviewIds = getInterviewIds;
const deleteInterview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { interviewId } = req.params;
    try {
        const deletedInterview = yield (0, interview_service_1.deleteInterviewService)(interviewId);
        res.status(200).json({ message: "Interview deleted successfully", deletedInterview });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteInterview = deleteInterview;
const getInterviewSettings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { interviewId } = req.params;
        const interviewSettings = yield (0, interview_service_1.getInterviewSettingsService)(interviewId);
        res.status(200).json(interviewSettings);
    }
    catch (error) {
        next(error);
    }
});
exports.getInterviewSettings = getInterviewSettings;
const updateInterview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { interviewId } = req.params;
        const { interviewTitle, expireDate, packageIds, canSkip, showAtOnce } = req.body;
        // updateInterviewService ile interview'ı güncelle
        const updatedInterview = yield (0, interview_service_1.updateInterviewService)(interviewId, interviewTitle, expireDate, packageIds, canSkip, showAtOnce);
        res.status(200).json(updatedInterview); // Güncellenmiş interview'ı döndür
    }
    catch (error) {
        next(error); // Hataları yakalayıp bir sonraki middleware'e ilet
    }
});
exports.updateInterview = updateInterview;
