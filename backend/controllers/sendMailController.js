/* eslint-disable no-unused-vars */
import nodemailer from "nodemailer";
import UserModel from "../models/User.js";
import VerificationCodeModel from "../models/VerificationCode.js";
import bcrypt from "bcrypt";

// Проверка email
export const checkEmail = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.json({ exists: true });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при проверке email" });
  }
};

// Отправка кода на email
export const sendCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Пользователь с таким email не найден" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await VerificationCodeModel.findOneAndUpdate(
      { email },
      { code, createdAt: new Date() },
      { upsert: true, new: true }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "osmangamidov026@gmail.com",
        pass: "jkra cjsu njhk hcjl",
      },
    });

    await transporter.sendMail({
      from: '"IT Academy" <osmangamidov026@gmail.com>',
      to: email,
      subject: "Код подтверждения",
      text: `Ваш код подтверждения: ${code}`,
    });

    res.json({ message: "Код отправлен на email" });
  } catch (err) {
    console.error("Ошибка при отправке кода:", err);
    res.status(500).json({ message: "Ошибка при отправке кода" });
  }
};

// Проверка кода
export const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: "Email и код обязательны" });
  }

  try {
    const record = await VerificationCodeModel.findOne({ email });
    if (!record || record.code !== code) {
      return res.status(400).json({ message: "Неверный код" });
    }

    res.json({ message: "Код подтверждён" });
  } catch (err) {
    console.error("Ошибка при проверке кода:", err);
    res.status(500).json({ message: "Ошибка при проверке кода" });
  }
};

// Сброс пароля
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await UserModel.updateOne({ email }, { passwordHash });

    res.json({ message: "Пароль успешно обновлён" });
  } catch (error) {
    console.error("Ошибка при сбросе пароля:", error);
    res.status(500).json({ message: "Ошибка при сбросе пароля" });
  }
};

// Отправка заявки на курс
export const sendMail = async (req, res) => {
  const { fullName, email, phone, title } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "osmangamidov026@gmail.com",
      pass: "jkra cjsu njhk hcjl",
    },
  });

  const adminMailOptions = {
    from: `"Сайт Курсов IT-Acadremy" <osmangamidov026@gmail.com>`,
    to: "osmangamidov025@gmail.com",
    subject: `Новая заявка на курс: ${title}`,
    text: `ФИО: ${fullName}\nEmail: ${email}\nТелефон: ${phone}\nКурс: ${title}`,
  };

  const userMailOptions = {
    from: `"Сайт Курсов IT-Acadremy" <osmangamidov026@gmail.com>`,
    to: email,
    subject: `Вы записались на курс: ${title}`,
    text: `Здравствуйте, ${fullName}!\n\nВы успешно подали заявку на курс "${title}". Мы скоро с вами свяжемся.\n\nСпасибо!\n\nВаш телефон: ${phone}`,
  };

  try {
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);
    res.status(200).json({ message: "Заявка отправлена успешно" });
  } catch (error) {
    console.error("Ошибка при отправке письма:", error);
    res.status(500).json({ message: "Ошибка сервера при отправке письма" });
  }
};
