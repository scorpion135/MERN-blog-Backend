import mongoose from "mongoose";

// Создаем схему таблицы в базе данных
const CommentSchema = new mongoose.Schema(
  // Все свойства, которые могут быть у пользователя
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    // Дата создания и обновления
    timestamps: true,
  }
);

export default mongoose.model("Comment", CommentSchema);
