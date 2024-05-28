import mongoose from "mongoose";

// Создаем схему таблицы в базе данных
const UserSchema = new mongoose.Schema(
  // Все свойства, которые могут быть у пользователя
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String,
  },
  {
    // Дата создания и обновления
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
