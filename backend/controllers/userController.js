import { validationResult } from 'express-validator';
import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      firstName: req.body.firstName,
      email: req.body.email,
      avatarUrl: req.body.avatarUrl,
      passwordHash,
      role: req.body.role || "user",
    });

    const user = await doc.save();

    const token = jwt.sign(
      { _id: user._id },
      'secret123',
      { expiresIn: '30d' }
    );

    const { passwordHash: _, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({ message: 'Неверный логин или пароль' });
    }

    const token = jwt.sign(
      { _id: user._id },
      'secret123',
      { expiresIn: '30d' }
    );

    const { passwordHash: _, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const { passwordHash: _, ...userData } = user._doc;

    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Нет доступа' });
  }
};

export const update = async (req, res) => {
  try {
    const userId = req.params.id;

    await UserModel.updateOne(
      { _id: userId },
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        middleName: req.body.middleName,
        birthDate: req.body.birthDate,
        gender: req.body.gender,
        phone: req.body.phone,
        country: req.body.country,
        city: req.body.city,
        email: req.body.email,
        avatarUrl: req.body.avatarUrl,
      }
    );

    res.json({ message: true });
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    res.status(500).json({
      success: false,
      message: "Не удалось обновить профиль",
    });
  }
};
