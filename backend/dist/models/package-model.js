"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PackageSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: false,
    },
    questions: [
        {
            questionText: {
                type: String,
                required: false,
            },
            timeLimit: {
                type: Number,
                required: false,
            },
            sequenceNumber: {
                type: Number,
                required: false, // Sıra numarası zorunlu olarak işaretlenir
            },
        },
    ],
    totalQuestions: {
        type: Number,
        default: 0,
    }
});
// Kaydetmeden önce totalQuestions'ı günceller
PackageSchema.pre('save', function (next) {
    this.totalQuestions = this.questions.length; // questions dizisinin uzunluğuna göre güncellenir
    next();
});
const Package = mongoose_1.default.model('Package', PackageSchema);
exports.default = Package;
