import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import {
  registerValidation,
  loginValidation,
  direction,
  course,
} from "./validations.js";
import checkAuth, { isAdmin } from "./middleware/checkAuth.js";

import * as UserController from "./controllers/userController.js";
import * as DirectionController from "./controllers/DirectionController.js";
import * as CourseController from "./controllers/CourseController.js";
import * as sendMailController from "./controllers/sendMailController.js";
import * as Favorites from "./controllers/Favorites.js";
import * as applicationController from "./controllers/ApplicationsController.js";

const app = express();

// Подключение к MongoDB
mongoose
  .connect(
    "mongodb+srv://admin:17osma17@cluster0.mfwiazl.mongodb.net/kyrsovay?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("✅ DB OK"))
  .catch((error) => console.log("❌ DB error", error));

// Middleware
app.use(express.json());
app.use(cors());

// ----------- API Роуты -----------
// Favorites
app.get("/favorites", checkAuth, Favorites.getAll);
app.post("/favorites/:courseId", checkAuth, Favorites.create_or_delete);

// Email
app.post("/api/send-email", sendMailController.sendMail);
app.post("/api/send-code-register", sendMailController.sendCodeRegister);
app.post("/api/send-code-reset", sendMailController.sendCodeReset);
app.post("/api/verify-code", sendMailController.verifyCode);
app.post("/api/reset-password", sendMailController.resetPassword);
app.post("/api/check-email", sendMailController.checkEmail);

// Auth
app.post("/login", loginValidation, UserController.login);
app.get("/profile/:id", checkAuth, UserController.getMe);
app.patch("/profile/:id", checkAuth, UserController.update);
app.post("/register", registerValidation, UserController.register);

// Направления
app.get("/directions", DirectionController.getAll);
app.post("/directions", direction, DirectionController.create);

// Курсы
app.get("/courses", CourseController.getAll);
app.get("/courses/:id", CourseController.getOne);
app.post("/courses", course, CourseController.create);
app.delete("/courses/:id", CourseController.remove);
app.patch("/courses/:id", CourseController.update);

// Заявки
app.post("/applications", checkAuth, applicationController.create);
app.get(
  "/applications/user/:userId",
  checkAuth,
  applicationController.getUserApplications
);
app.get("/applications", checkAuth, isAdmin, applicationController.getAll);
app.patch(
  "/applications/:id/status",
  checkAuth,
  isAdmin,
  applicationController.updateStatus
);
app.delete(
  "/applications/:id",
  checkAuth,
  isAdmin,
  applicationController.remove
);

// ----------- React SPA Static -----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, "..", "dist"); // dist находится рядом с backend

app.use(express.static(clientBuildPath));

// Fallback для React Router
app.get("*any", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// ----------- Запуск сервера -----------
app.listen(3001, () => {
  console.log("🚀 Сервер запущен на порту 3001");
});
