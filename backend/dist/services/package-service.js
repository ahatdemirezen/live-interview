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
exports.getPackageByIdService = exports.addNewQuestions = exports.updateQuestionOrderService = exports.updateQuestionService = exports.deleteQuestionFromPackageService = exports.updatePackageTitle = exports.deletePackageService = exports.getAllPackagesService = exports.createPackageService = void 0;
const package_model_1 = __importDefault(require("../models/package-model")); // Package şemasını import et
const mongoose_1 = __importDefault(require("mongoose"));
const http_errors_1 = __importDefault(require("http-errors"));
// Package oluşturma servisi
const createPackageService = (title, questions) => __awaiter(void 0, void 0, void 0, function* () {
    const newPackage = new package_model_1.default({
        title,
        questions,
    });
    // Veritabanına kaydet
    const savedPackage = yield newPackage.save();
    return savedPackage;
});
exports.createPackageService = createPackageService;
// Tüm package'ları getirme servisi
const getAllPackagesService = () => __awaiter(void 0, void 0, void 0, function* () {
    const packages = yield package_model_1.default.find(); // Tüm paketleri veritabanından çek
    return packages;
});
exports.getAllPackagesService = getAllPackagesService;
// Package silme servisi
const deletePackageService = (packageId) => __awaiter(void 0, void 0, void 0, function* () {
    // packageId'nin geçerli olup olmadığını kontrol et
    if (!mongoose_1.default.isValidObjectId(packageId)) {
        throw (0, http_errors_1.default)(400, "Invalid packageId");
    }
    // İlgili package'i bul ve sil
    const deletedPackage = yield package_model_1.default.findByIdAndDelete(packageId);
    // Package bulunamadıysa hata fırlat
    if (!deletedPackage) {
        throw (0, http_errors_1.default)(404, "Package not found");
    }
    return deletedPackage;
});
exports.deletePackageService = deletePackageService;
// Package güncelleme servisi
const updatePackageTitle = (packageId, title) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.isValidObjectId(packageId)) {
        throw (0, http_errors_1.default)(400, "Invalid packageId");
    }
    const packageData = yield package_model_1.default.findById(packageId);
    if (!packageData) {
        throw (0, http_errors_1.default)(404, "Package not found");
    }
    packageData.title = title;
    const updatedPackage = yield packageData.save();
    return updatedPackage;
});
exports.updatePackageTitle = updatePackageTitle;
// Soruları silme fonksiyonu
const deleteQuestionFromPackageService = (packageId, questionId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.isValidObjectId(packageId) || !mongoose_1.default.isValidObjectId(questionId)) {
        throw (0, http_errors_1.default)(400, "Invalid packageId or questionId");
    }
    const packageData = yield package_model_1.default.findById(packageId);
    if (!packageData) {
        throw (0, http_errors_1.default)(404, "Package not found");
    }
    const question = packageData.questions.id(questionId);
    if (!question) {
        throw (0, http_errors_1.default)(404, "Question not found");
    }
    packageData.questions.pull({ _id: questionId });
    const updatedPackage = yield packageData.save();
    return updatedPackage;
});
exports.deleteQuestionFromPackageService = deleteQuestionFromPackageService;
const updateQuestionService = (packageId, questionId, updates) => __awaiter(void 0, void 0, void 0, function* () {
    // packageId ve questionId'nin geçerli olup olmadığını kontrol et
    if (!mongoose_1.default.isValidObjectId(packageId) || !mongoose_1.default.isValidObjectId(questionId)) {
        throw (0, http_errors_1.default)(400, "Invalid packageId or questionId");
    }
    // İlgili package'i bul
    const packageData = yield package_model_1.default.findById(packageId);
    if (!packageData) {
        throw (0, http_errors_1.default)(404, "Package not found");
    }
    // Soruyu bul ve güncelle
    const question = packageData.questions.id(questionId);
    if (!question) {
        throw (0, http_errors_1.default)(404, "Question not found");
    }
    if (updates.questionText) {
        question.questionText = updates.questionText;
    }
    if (updates.timeLimit) {
        question.timeLimit = updates.timeLimit;
    }
    // Güncellemeleri kaydet ve güncellenmiş paketi döndür
    const updatedPackage = yield packageData.save();
    return updatedPackage;
});
exports.updateQuestionService = updateQuestionService;
const updateQuestionOrderService = (packageId, questions) => __awaiter(void 0, void 0, void 0, function* () {
    const packageData = yield package_model_1.default.findById(packageId); // Paketi veritabanından bul
    if (!packageData) {
        throw new Error('Package not found'); // Eğer paket bulunmazsa hata fırlat
    }
    // Soruların sıralamasını güncelle
    questions.forEach((q) => {
        const question = packageData.questions.id(q.questionId); // Soruyu bul
        if (question) {
            question.sequenceNumber = q.sequenceNumber; // Yeni sıralamayı atayın
        }
    });
    yield packageData.save(); // Paketi kaydet (MongoDB'ye güncellemeleri kaydet)
    return packageData; // Güncellenmiş paketi geri döndür
});
exports.updateQuestionOrderService = updateQuestionOrderService;
// Yeni sorular ekleme fonksiyonu
const addNewQuestions = (packageId, newQuestions) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.isValidObjectId(packageId)) {
        throw (0, http_errors_1.default)(400, "Invalid packageId");
    }
    const packageData = yield package_model_1.default.findById(packageId);
    if (!packageData) {
        throw (0, http_errors_1.default)(404, "Package not found");
    }
    // newQuestions'ın undefined olup olmadığını kontrol et
    if (!newQuestions || !Array.isArray(newQuestions)) {
        throw (0, http_errors_1.default)(400, "newQuestions is required and should be an array");
    }
    // Mevcut soruların sayısını alın, bu sequenceNumber'ın başlangıcı olacak
    const currentQuestionCount = packageData.questions.length;
    // Yeni soruları sıralama numarası ekleyerek ekleyin
    newQuestions.forEach(({ questionText, timeLimit }, index) => {
        packageData.questions.push({
            questionText,
            timeLimit,
            sequenceNumber: currentQuestionCount + index + 1, // Sıra numarası birer artarak devam edecek
        });
    });
    const updatedPackage = yield packageData.save();
    return updatedPackage;
});
exports.addNewQuestions = addNewQuestions;
const getPackageByIdService = (packageId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!packageId) {
        throw (0, http_errors_1.default)(400, "Package ID is required");
    }
    const packageData = yield package_model_1.default.findById(packageId);
    if (!packageData) {
        throw (0, http_errors_1.default)(404, "Package not found");
    }
    return packageData;
});
exports.getPackageByIdService = getPackageByIdService;
