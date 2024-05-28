import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";

import {
  UserController,
  PostController,
  CommentController,
} from "./controllers/index.js";

import { handleValidationErrors, checkAuth } from "./utils/index.js";

// Подключаемся к базе данных, если все норм - возвращается "DB OK", иначе сообщение об ошибке
mongoose
  .connect(
    "mongodb+srv://maxcurnosow2015:GzVgYwAJs10Qa4Nn@cluster0.3n56o7k.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("DB OK");
  })
  .catch((err) => console.log("DB Error", err));

// Создаем константу app, которая будет содержать методы express
const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Позволяет читать json, который будет приходить из запросов
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use(cors());

// Отлавливаем post-запрос авторизации пользователя
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);

// Отлавливаем post-запрос регистрации пользователя
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);

// Запрашиваем информацию о пользователе
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `uploads/${req.file.originalname}`,
  });
});

app.post("/upload/avatar", upload.single("image"), (req, res) => {
  res.json({
    url: `uploads/${req.file.originalname}`,
  });
});

// Создание статьи
app.get("/posts", PostController.getAll);
app.get("/posts/popular", PostController.getPopularSort);
app.get("/tags", PostController.getLastTags);
app.get("/comments", CommentController.getLastComments);
app.get("/comments/all", CommentController.getAllComments);
app.get("/comments/:id", CommentController.getOnePostComments);
app.get("/tags/:tag", PostController.getPostsFromTag);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.post("/comments", checkAuth, CommentController.createComment);
app.delete("/comments/:id", checkAuth, CommentController.deletePostComments);

app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

// Запускаем сервер на порту 4444
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
