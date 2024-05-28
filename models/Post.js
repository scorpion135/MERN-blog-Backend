import mongoose from "mongoose";

// Создаем схему таблицы в базе данных
const PostSchema = new mongoose.Schema(
  // Все свойства, которые могут быть у пользователя
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: String,
  },
  {
    // Дата создания и обновления
    timestamps: true,
  }
);

export default mongoose.model("Post", PostSchema);
