import { User } from "../models/User.js";
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });

    //revisar si extiste el usuario
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      throw { code: 11000 };
    }

    const userStore = await user.save();

    // Generar el JWT token
    const { token, expiresIn } = generateToken(userStore._id);
    generateRefreshToken(userStore._id, res);

    return res.status(201).json({ token, expiresIn });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(400).json({ error: "Ya existe este usuario" });
    }
    return res
      .status(500)
      .json({ error: "Error de servidor", msg: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //revisar si extiste el usuario
    const userEmail = await User.findOne({ email });

    if (!userEmail) {
      return res.status(403).json({ error: "No existe este usuario" });
    }

    const responsePassword = await userEmail.comparePassword(password);

    if (!responsePassword) {
      return res.status(403).json({ error: "Contraseña Incorrecta" });
    }

    // Generar el JWT token
    const { token, expiresIn } = generateToken(userEmail.id);
    generateRefreshToken(userEmail.id, res);

    //res.cookie(token);

    return res.json({ token, expiresIn });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor" });
  }
};

export const infouser = async (req, res) => {
  try {
    const user = await User.findById(req.uid).lean();
    return res.json({ email: user.email, uid: user._id });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ error: "Error de servidor", msg: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = generateToken(req.uid);
    res.json(token);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error de servidor", msg: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ ok: true });
};
