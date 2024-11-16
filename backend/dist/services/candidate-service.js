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
exports.updateCandidateNoteService = exports.updateCandidateStatusService = exports.createPersonalInfoService = exports.getAllPersonalInfoService = void 0;
const candidate_model_1 = __importDefault(require("../models/candidate-model"));
const interview_model_1 = __importDefault(require("../models/interview-model"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_errors_1 = __importDefault(require("http-errors"));
// Tüm kişisel bilgileri getirme
const getAllPersonalInfoService = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield candidate_model_1.default.find();
});
exports.getAllPersonalInfoService = getAllPersonalInfoService;
// Yeni kişisel bilgi ekleme
const createPersonalInfoService = (name, surname, email, phone, interviewId) => __awaiter(void 0, void 0, void 0, function* () {
    // interviewId'nin geçerli bir ObjectId olup olmadığını kontrol et
    if (!mongoose_1.default.isValidObjectId(interviewId)) {
        throw new Error('Geçersiz Interview ID');
    }
    // Interview'ı bulalım
    const interview = yield interview_model_1.default.findById(interviewId);
    if (!interview) {
        throw new Error('Interview bulunamadı');
    }
    // Yeni kişisel bilgileri (adayı) ekle
    const newPersonalInfo = new candidate_model_1.default({
        name,
        surname,
        email,
        phone,
    });
    // Adayı kaydet
    const savedPersonalInfo = yield newPersonalInfo.save();
    // Interview'a bu adayın ID'sini (personalInformationForms listesine) ekleyelim
    interview.personalInformationForms.push(savedPersonalInfo._id);
    yield interview.save();
    return savedPersonalInfo;
});
exports.createPersonalInfoService = createPersonalInfoService;
const updateCandidateStatusService = (formId, status) => __awaiter(void 0, void 0, void 0, function* () {
    // Geçerli statü değerlerini kontrol ediyoruz
    const validStatuses = ['pending', 'passed', 'failed'];
    if (!validStatuses.includes(status)) {
        throw (0, http_errors_1.default)(400, 'Geçersiz statü değeri');
    }
    // Formu güncelleme işlemi
    const updatedForm = yield candidate_model_1.default.findByIdAndUpdate(formId, { status }, { new: true });
    if (!updatedForm) {
        throw (0, http_errors_1.default)(404, 'Candidate form not found');
    }
    return updatedForm;
});
exports.updateCandidateStatusService = updateCandidateStatusService;
const updateCandidateNoteService = (formId, note) => __awaiter(void 0, void 0, void 0, function* () {
    // Formu güncelleme işlemi
    const updatedCandidate = yield candidate_model_1.default.findByIdAndUpdate(formId, { note }, { new: true } // Güncellenmiş belgeyi döndür
    );
    if (!updatedCandidate) {
        throw (0, http_errors_1.default)(404, "Aday bulunamadı");
    }
    return updatedCandidate;
});
exports.updateCandidateNoteService = updateCandidateNoteService;
