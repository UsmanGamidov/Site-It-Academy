import { body } from "express-validator";

export const loginValidation = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
];

export const registerValidation = [
  body("firstName").isLength({ min: 3 }).withMessage("Минимум 3 символа"),
  body("email").isEmail().withMessage("Некорректный email"),
  body("password").isLength({ min: 6 }).withMessage("Минимум 6 символов"),
];

export const direction = [
  body("title").isString().isLength({ min: 5 }),
  body("tags").isString().notEmpty(), // или .isLength({ min: 1 })
];

export const course = [
  body("title").isString().notEmpty(),
  body("description").isString().notEmpty(),
  body("courseTime").notEmpty(),
  body("grade").isNumeric(),
  body("popular").isBoolean(),
  body("tags").isArray(), // или isString() если это строка
  body("imageUrl").isURL().optional(),
];
