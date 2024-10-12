import mongoose, { Schema, Types } from 'mongoose';

// Interview şeması
const InterviewSchema = new Schema({
  interviewTitle: {
    type: String,
    required: true,  
  },
  expireDate: {
    type: Date, // Sona erme tarihi
    required: true,
  },
  packageId: [{
    type: Types.ObjectId,
    ref: 'Package',
    required: true,
  }],  
});

const Interview = mongoose.model('Interview', InterviewSchema);

export default Interview;
