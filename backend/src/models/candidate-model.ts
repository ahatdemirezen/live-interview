import mongoose, { Schema } from "mongoose";

const PersonalInformationFormSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
    },
    phone: {
      type: String,
      required: true,
      match: /^\d{10,15}$/,  // Telefon numarasının uzunluğunu kontrol etmek için
    },
    videoPath: {
      type: String,  // Video dosyasının yolunu tutacak alan
      default: '',   // Varsayılan olarak boş, video yüklendiğinde güncellenecek
    },
  },
  {
    timestamps: true, // createdAt ve updatedAt alanlarını otomatik olarak ekler
  }
);

// Modeli oluşturma
const PersonalInformationForm = mongoose.model(
  "PersonalInformationForm",
  PersonalInformationFormSchema
);

export default PersonalInformationForm;
