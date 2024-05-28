import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";

// Функция регистрации пользователя
export const register = async (req, res) => {
  try {
    // результат валидации (получаем все ошибки)
    const password = req.body.password;

    // Хэшируем пароль
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Создаем модель пользователя в БД
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    // Сохраняем пользователя в БД
    const user = await doc.save();

    // После внесения пользователя в БД, создаем токен пользователя
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    // Возращаем информацию о пользователе и токен
    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};

// Функция авторизации пользователя ( проверка )
export const login = async (req, res) => {
  try {
    // Находим пользователя в БД по введенной почте
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    // Сравниваем введенный пароль с паролем в БД
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    // Если все верно - создаем токен
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
};

// Функция получения информации о пользователе
export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};
