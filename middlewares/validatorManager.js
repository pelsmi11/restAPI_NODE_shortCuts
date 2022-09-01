import axios from "axios";
import { validationResult, body, param } from "express-validator";

export const validationResultExpress = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export const bodyRegisterValidator = [
  body("email", "Formato de email incorrecto")
    .trim()
    .isEmail()
    .normalizeEmail(),
  body("password", "Minimo 6 caracteres").trim().isLength({ min: 6 }),
  validationResultExpress,
];

export const paramLinkValidator = [
  param("id", "Formato no válido (expressValidator)")
    .trim()
    .notEmpty()
    .escape(),
  validationResultExpress,
];

export const bodyLinkValidator = [
  body("longLing", "formato link incorrecto")
    .trim()
    .notEmpty()
    .custom(async (value) => {
      try {
        if (value.startsWith("http://")) {
          value = value.replace("http://", "https://");
        }
        if (!value.startsWith("https://")) {
          value = "https://" + value;
        }
        await axios.get(value);
        return value;
      } catch (error) {
        // console.log(error);
        throw new Error("not found longLing 404");
      }
    }),
  validationResultExpress,
];

export const bodyLoginValidator = [
  body("email", "Formato de email incorrecto")
    .trim()
    .isEmail()
    .normalizeEmail(),
  body("password", "Minimo 6 caracteres").trim().isLength({ min: 6 }),
  validationResultExpress,
];
