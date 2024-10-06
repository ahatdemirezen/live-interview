import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true, 
  },
  questions: [
    {
      questionText: {
        type: String,
        required: true,  
      },
      timeLimit: {
        type: Number,  
        required: true,  
      },
      sequenceNumber: {
        type: Number,
        required: true,  // Sıra numarası zorunlu olarak işaretlenir
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
  this.totalQuestions = this.questions.length;  // questions dizisinin uzunluğuna göre güncellenir
  next();
});

const Package = mongoose.model('Package', PackageSchema);

export default Package;
