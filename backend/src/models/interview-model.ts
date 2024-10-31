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
  personalInformationForms: [{ 
    type: Types.ObjectId, 
    ref: 'PersonalInformationForm', // Referans gösterilen schema
    required: true,
  }],
  canSkip: {
    type: Boolean,
    default: false,  // Varsayılan olarak false
  },
  showAtOnce: {
    type: Boolean,
    default: false,  // Varsayılan olarak false
  },
});

const Interview = mongoose.model('Interview', InterviewSchema);

export default Interview;
