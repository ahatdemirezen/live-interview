import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
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
