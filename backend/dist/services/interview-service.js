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
exports.addPackageToInterviewService = exports.updateInterviewService = exports.getInterviewSettingsService = exports.getInterviewExpireDateService = exports.getPersonalFormsByInterviewService = exports.getPackageQuestionsByInterviewService = exports.deleteInterviewService = exports.fetchInterviewIds = exports.getInterviewsService = exports.createInterviewService = void 0;
const interview_model_1 = __importDefault(require("../models/interview-model"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_errors_1 = __importDefault(require("http-errors"));
const package_model_1 = __importDefault(require("../models/package-model")); // Package şemasını import et
const candidate_model_1 = __importDefault(require("../models/candidate-model"));
// Interview oluşturma servisi
const createInterviewService = (interviewTitle, expireDate, packageIds, canSkip, showAtOnce) => __awaiter(void 0, void 0, void 0, function* () {
    // Gelen packageIds'in bir array olup olmadığını kontrol et
    if (!Array.isArray(packageIds)) {
        throw (0, http_errors_1.default)(400, "packageIds must be an array");
    }
    // Her bir packageId'nin geçerli bir ObjectId olup olmadığını ve var olup olmadığını kontrol et
    for (const packageId of packageIds) {
        if (!mongoose_1.default.isValidObjectId(packageId)) {
            throw (0, http_errors_1.default)(400, `Invalid packageId format: ${packageId}`);
        }
        const packageExists = yield package_model_1.default.findById(packageId);
        if (!packageExists) {
            throw (0, http_errors_1.default)(404, `Package not found: ${packageId}`);
        }
    }
    // Interview nesnesini oluştur
    const newInterview = new interview_model_1.default({
        interviewTitle,
        expireDate,
        packageId: packageIds, // Artık bir array olarak kaydediyoruz
        canSkip, // Yeni eklenen değer
        showAtOnce, // Yeni eklenen değer
    });
    // Veritabanına kaydet
    const savedInterview = yield newInterview.save();
    return savedInterview;
});
exports.createInterviewService = createInterviewService;
// Tüm interview'ları getirme servisi
const getInterviewsService = () => __awaiter(void 0, void 0, void 0, function* () {
    // Interview'leri packageId ve personalInformationForms ile populate et
    const interviews = yield interview_model_1.default.find()
        .populate('packageId', '_id title')
        .populate('personalInformationForms', '_id status') // personalInformationForms ile gerekli alanları çek
        .lean();
    // Her interview için totalForms ve pendingForms sayısını hesapla
    const interviewsWithStats = interviews.map((interview) => {
        const personalForms = interview.personalInformationForms;
        const totalForms = personalForms.length;
        const pendingForms = personalForms.filter((form) => form.status === 'pending').length;
        return Object.assign(Object.assign({}, interview), { totalForms,
            pendingForms });
    });
    return interviewsWithStats;
});
exports.getInterviewsService = getInterviewsService;
const fetchInterviewIds = () => __awaiter(void 0, void 0, void 0, function* () {
    const interviews = yield interview_model_1.default.find({}, { _id: 1 });
    if (!interviews || interviews.length === 0) {
        throw new Error("No interviews found");
    }
    // Interview ID'lerini döndür
    return interviews.map((interview) => interview._id.toString());
});
exports.fetchInterviewIds = fetchInterviewIds;
const deleteInterviewService = (interviewId) => __awaiter(void 0, void 0, void 0, function* () {
    // interviewId'nin geçerli olup olmadığını kontrol et
    if (!mongoose_1.default.isValidObjectId(interviewId)) {
        throw (0, http_errors_1.default)(400, "Invalid interviewId");
    }
    // İlgili interview'ı bul ve sil
    const deletedInterview = yield interview_model_1.default.findByIdAndDelete(interviewId);
    // Interview bulunamadıysa hata fırlat
    if (!deletedInterview) {
        throw (0, http_errors_1.default)(404, "Interview not found");
    }
    return deletedInterview;
});
exports.deleteInterviewService = deleteInterviewService;
const getPackageQuestionsByInterviewService = (interviewId) => __awaiter(void 0, void 0, void 0, function* () {
    // Interview'i bulma ve packageId'leri getirme
    const interview = yield interview_model_1.default.findById(interviewId).populate("packageId");
    if (!interview) {
        throw (0, http_errors_1.default)(404, "Interview not found");
    }
    const pckgs = yield Promise.all(interview === null || interview === void 0 ? void 0 : interview.packageId.map((pckgId) => __awaiter(void 0, void 0, void 0, function* () {
        const pckg = yield package_model_1.default.findById(pckgId);
        return pckg;
    })));
    // Paketlerin sorularını düzenleme
    const packageQuestions = pckgs.map((pkg) => ({
        packageId: pkg === null || pkg === void 0 ? void 0 : pkg._id,
        questions: pkg === null || pkg === void 0 ? void 0 : pkg.questions,
    }));
    return {
        interviewId: interview._id,
        packages: packageQuestions,
    };
});
exports.getPackageQuestionsByInterviewService = getPackageQuestionsByInterviewService;
const getPersonalFormsByInterviewService = (interviewId_1, ...args_1) => __awaiter(void 0, [interviewId_1, ...args_1], void 0, function* (interviewId, page = 1, limit = 12) {
    try {
        // Interview'i bulma ve personalForms IDs listesini alma
        const interview = yield interview_model_1.default.findById(interviewId).select("personalInformationForms");
        if (!interview) {
            throw (0, http_errors_1.default)(404, "Interview not found");
        }
        // Sayfalama için skip ve limit değerlerini hesaplama
        const skip = (page - 1) * limit;
        // personalForms listesindeki ID'lere göre PersonalInformationForm verisini çekiyoruz
        const personalForms = yield candidate_model_1.default.find({
            _id: { $in: interview.personalInformationForms },
        })
            .skip(skip)
            .limit(limit);
        // Toplam aday sayısını Interview'deki personalForms IDs uzunluğundan alıyoruz
        const totalCount = interview.personalInformationForms.length;
        return { personalForms, totalCount };
    }
    catch (error) {
        console.error("Error fetching personal forms by interview:", error);
        throw error;
    }
});
exports.getPersonalFormsByInterviewService = getPersonalFormsByInterviewService;
const getInterviewExpireDateService = (interviewId) => __awaiter(void 0, void 0, void 0, function* () {
    // Interview'i bulma
    const interview = yield interview_model_1.default.findById(interviewId);
    if (!interview) {
        throw (0, http_errors_1.default)(404, "Interview not found");
    }
    // Interview bulunduysa, expireDate'i döndür
    return interview.expireDate;
});
exports.getInterviewExpireDateService = getInterviewExpireDateService;
const getInterviewSettingsService = (interviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const interview = yield interview_model_1.default.findById(interviewId).select("canSkip showAtOnce");
    if (!interview) {
        throw (0, http_errors_1.default)(404, "Interview not found");
    }
    return {
        canSkip: interview.canSkip,
        showAtOnce: interview.showAtOnce,
    };
});
exports.getInterviewSettingsService = getInterviewSettingsService;
const updateInterviewService = (interviewId, interviewTitle, expireDate, packageIds, canSkip, showAtOnce) => __awaiter(void 0, void 0, void 0, function* () {
    // Interview ID'nin geçerliliğini kontrol et
    if (!mongoose_1.default.isValidObjectId(interviewId)) {
        throw (0, http_errors_1.default)(400, "Invalid interview ID format");
    }
    // Güncellenmesi istenen alanları bir obje olarak hazırlıyoruz
    const updateFields = {};
    if (interviewTitle !== undefined)
        updateFields.interviewTitle = interviewTitle;
    if (expireDate !== undefined)
        updateFields.expireDate = expireDate;
    if (packageIds !== undefined)
        updateFields.packageId = packageIds;
    if (canSkip !== undefined)
        updateFields.canSkip = canSkip;
    if (showAtOnce !== undefined)
        updateFields.showAtOnce = showAtOnce;
    // İlgili Interview kaydını bul ve güncelle
    const updatedInterview = yield interview_model_1.default.findByIdAndUpdate(interviewId, updateFields, { new: true, runValidators: true } // Güncellenmiş belgeyi döndür ve validatorleri çalıştır
    ).populate("packageId", "_id title"); // packageId alanını populate ederek _id ve title bilgilerini alıyoruz
    if (!updatedInterview) {
        throw (0, http_errors_1.default)(404, "Interview not found");
    }
    return updatedInterview;
});
exports.updateInterviewService = updateInterviewService;
const addPackageToInterviewService = (interviewId, packageId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.isValidObjectId(packageId)) {
        throw (0, http_errors_1.default)(400, "Invalid packageId format");
    }
    const updatedInterview = yield interview_model_1.default.findByIdAndUpdate(interviewId, { $addToSet: { packageId } }, // packageId dizisine ekleme yapıyoruz
    { new: true }).populate("packageId", "_id title"); // _id ve title alanlarını getir
    if (!updatedInterview) {
        throw (0, http_errors_1.default)(404, "Interview not found");
    }
    return updatedInterview;
});
exports.addPackageToInterviewService = addPackageToInterviewService;
