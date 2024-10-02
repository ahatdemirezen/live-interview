import mongoose from 'mongoose';

const InterviewSchema = new mongoose.Schema({
  interviewName: {
    type: String,
    required: true,  
  },
  questionPackage: {
    type: [String],  // Birden fazla soru paketi seçilebilir
    required: true,  // Soru paketi seçimi zorunlu
  },
  startDate: {
    type: Date,
    required: true, 
  },
  endDate: {
    type: Date,
    required: true,
  },
});

const Interview = mongoose.model('Interview', InterviewSchema);

export default Interview;
