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
    videoId: {
      type: String,  // Video ID'sini tutan alan, herhangi bir şemaya referans vermiyor
      default: null, // Varsayılan olarak null
    },
    status: {
     type: String,
     enum: ['pending', 'passed', 'failed'],
     default: 'pending',
    },
    note: {
      type: String,
      default: '', // Varsayılan olarak boş bir string atanır
    },
    alert: {
      type : Boolean,
      default : false
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
