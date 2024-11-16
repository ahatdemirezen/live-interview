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
exports.getPackageById = exports.addNewQuestionsController = exports.updateQuestionController = exports.deleteQuestionController = exports.updatePackageTitleController = exports.updateQuestionOrderController = exports.deletePackage = exports.getAllPackages = exports.createPackage = void 0;
const package_service_1 = require("../services/package-service"); // Service'i import et
// Package oluşturma
const createPackage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, questions } = req.body;
        const savedPackage = yield (0, package_service_1.createPackageService)(title, questions);
        res.status(201).json(savedPackage);
    }
    catch (error) {
        next(error);
    }
});
exports.createPackage = createPackage;
// Tüm package'ları getirme
const getAllPackages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const packages = yield (0, package_service_1.getAllPackagesService)();
        res.status(200).json(packages);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllPackages = getAllPackages;
// Package silme
const deletePackage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { packageId } = req.params;
        const deletedPackage = yield (0, package_service_1.deletePackageService)(packageId);
        res.status(200).json({ message: "Package deleted successfully", deletedPackage });
    }
    catch (error) {
        next(error);
    }
});
exports.deletePackage = deletePackage;
const updateQuestionOrderController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { packageId } = req.params;
    const { questions } = req.body; // Frontend'den gelen sıralama bilgisi
    try {
        // Service katmanını çağırarak sıralamayı güncelle
        const updatedPackage = yield (0, package_service_1.updateQuestionOrderService)(packageId, questions);
        res.status(200).json({
            message: 'Questions order updated successfully',
            package: updatedPackage,
        });
    }
    catch (error) {
        next(error); // Hata varsa next fonksiyonuna gönder (middleware'ler tarafından işlenir)
    }
});
exports.updateQuestionOrderController = updateQuestionOrderController;
// Package güncelleme
const updatePackageTitleController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { packageId } = req.params;
    const { title } = req.body;
    try {
        const updatedPackage = yield (0, package_service_1.updatePackageTitle)(packageId, title);
        res.status(200).json(updatedPackage);
    }
    catch (error) {
        next(error);
    }
});
exports.updatePackageTitleController = updatePackageTitleController;
// Soruları silme
const deleteQuestionController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { packageId } = req.params;
    const { questionId } = req.body; // questionId'yi body'den alıyoruz.
    try {
        const updatedPackage = yield (0, package_service_1.deleteQuestionFromPackageService)(packageId, questionId);
        res.status(200).json({
            message: "Question deleted successfully",
            package: updatedPackage,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteQuestionController = deleteQuestionController;
const updateQuestionController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { packageId, questionId } = req.params; // URL'den packageId ve questionId'yi alıyoruz
    const { questionText, timeLimit } = req.body; // Güncellenecek verileri body'den alıyoruz
    try {
        const updatedPackage = yield (0, package_service_1.updateQuestionService)(packageId, questionId, {
            questionText,
            timeLimit,
        });
        res.status(200).json({
            message: "Question updated successfully",
            package: updatedPackage,
        });
    }
    catch (error) {
        next(error); // Hata varsa sonraki middleware'e gönder
    }
});
exports.updateQuestionController = updateQuestionController;
// Yeni sorular ekleme
const addNewQuestionsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { packageId } = req.params;
    const { newQuestions } = req.body;
    try {
        const updatedPackage = yield (0, package_service_1.addNewQuestions)(packageId, newQuestions);
        res.status(201).json({
            message: "Questions added successfully",
            package: updatedPackage,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.addNewQuestionsController = addNewQuestionsController;
const getPackageById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { packageId } = req.params;
    try {
        const packageData = yield (0, package_service_1.getPackageByIdService)(packageId);
        if (!packageData) {
            res.status(404).json({ message: "Package not found" });
        }
        else {
            res.status(200).json(packageData); // Response döndürülüyor
        }
    }
    catch (error) {
        next(error); // Hata döndürülüyor
    }
});
exports.getPackageById = getPackageById;
