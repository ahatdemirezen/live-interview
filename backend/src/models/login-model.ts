import mongoose, { Schema } from "mongoose";

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

// Kullanıcı modelini oluşturma
const User = mongoose.model("User", UserSchema);

export default User;
