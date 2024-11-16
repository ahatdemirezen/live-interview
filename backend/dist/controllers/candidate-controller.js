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
exports.updateUserAlert = exports.updateCandidateNote = exports.updateCandidateStatus = exports.createPersonalInfo = exports.getAllPersonalInfo = void 0;
const candidate_service_1 = require("../services/candidate-service");
const candidate_model_1 = __importDefault(require("../models/candidate-model"));
// GET - Tüm kişisel bilgileri getirme
const getAllPersonalInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const personalInfos = yield (0, candidate_service_1.getAllPersonalInfoService)();
        res.status(200).json(personalInfos);
    }
    catch (error) {
        res.status(500).json({ message: 'Verileri getirirken bir hata oluştu', error });
    }
});
exports.getAllPersonalInfo = getAllPersonalInfo;
// POST - Yeni kişisel bilgileri ekleme
const createPersonalInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, surname, email, phone } = req.body;
    const { interviewId } = req.params; // URL'den interviewId alıyoruz
    try {
        const savedPersonalInfo = yield (0, candidate_service_1.createPersonalInfoService)(name, surname, email, phone, interviewId);
        res.status(201).json(savedPersonalInfo);
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Geçersiz Interview ID') {
                res.status(400).json({ message: error.message });
            }
            else if (error.message === 'Interview bulunamadı') {
                res.status(404).json({ message: error.message });
            }
            else {
                next(error); // Diğer hatalarda bir sonraki middleware'e geç
            }
        }
        else {
            next(error); // error, Error tipi değilse, yine de bir sonraki middleware'e geç
        }
    }
});
exports.createPersonalInfo = createPersonalInfo;
// Adayın status durumunu güncelleyen endpoint (formId'yi body'den alıyoruz)
const updateCandidateStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { formId, status } = req.body;
    try {
        // Service fonksiyonunu çağırıyoruz
        const updatedForm = yield (0, candidate_service_1.updateCandidateStatusService)(formId, status);
        // Başarı yanıtı döndürme
        return res.status(200).json({ message: 'Candidate status updated', updatedForm });
    }
    catch (error) {
        next(error); // Hataları middleware'e gönderiyoruz
    }
});
exports.updateCandidateStatus = updateCandidateStatus;
const updateCandidateNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { formId } = req.params; // Güncellenecek adayın formId'si
    const { note } = req.body; // Gönderilen not değeri
    try {
        // Service fonksiyonunu çağırıyoruz
        const updatedCandidate = yield (0, candidate_service_1.updateCandidateNoteService)(formId, note);
        // Başarı yanıtı döndürme
        res.status(200).json(updatedCandidate);
    }
    catch (error) {
        next(error); // Hataları middleware'e yönlendiriyoruz
    }
});
exports.updateCandidateNote = updateCandidateNote;
// Kullanıcı uyarı durumunu güncelleme
const updateUserAlert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { formId } = req.params;
    const { alert } = req.body;
    try {
        // Veritabanında kullanıcıyı bul ve alert alanını güncelle
        const updatedUser = yield candidate_model_1.default.findByIdAndUpdate(formId, { alert: alert }, { new: true } // Güncellenmiş kullanıcıyı döndür
        );
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Alert status updated successfully', user: updatedUser });
    }
    catch (error) {
        console.error('Error updating alert status:', error);
        res.status(500).json({ message: 'Error updating alert status', error });
    }
});
exports.updateUserAlert = updateUserAlert;
