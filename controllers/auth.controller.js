import { User } from "../models/User.js";
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
    return res.status(201).json({ userStore, ok: true });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(400).json({ error: "Ya existe este usuario" });
    }
    return res.status(500).json({ error: "Error de servidor" });
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
    const token = jwt.sign(
      { uid: responsePassword._id },
      process.env.JWT_SECRET
    );

    return res.json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor" });
  }
};
