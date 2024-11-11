import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionTime extends Document {
  interviewId: mongoose.Types.ObjectId; // Röportaj ID'si
  formId: mongoose.Types.ObjectId;      // Kullanıcı ID'si
  questionId: mongoose.Types.ObjectId;  // Soru ID'si
  startTime: Date;                      // Soru başlangıç zamanı
  endTime: Date;                        // Soru bitiş zamanı
}
// Yeni QuestionTime şeması
const questionTimeSchema = new Schema<IQuestionTime>({
  interviewId: { type: Schema.Types.ObjectId, ref: 'Interview', required: true },
  formId: { type: Schema.Types.ObjectId, ref: 'PersonalInformationForm', required: true },
  questionId: { type: Schema.Types.ObjectId, ref: 'Package.questions', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});
// QuestionTime modelini oluşturun
const QuestionTime = mongoose.model<IQuestionTime>('QuestionTime', questionTimeSchema);

export default QuestionTime;