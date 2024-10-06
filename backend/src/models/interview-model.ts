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
  packageId: {
    type: Types.ObjectId, // Package şemasına referans
    ref: 'Package',       // Referans verilen model adı
    required: true,
  },
});

const Interview = mongoose.model('Interview', InterviewSchema);

export default Interview;
