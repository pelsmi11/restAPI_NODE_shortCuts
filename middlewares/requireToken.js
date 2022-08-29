import jwt from "jsonwebtoken";

export const requireToken = (req, res, next) => {
  try {
    const token = req.headers?.authorization;
    if (!token) throw new Error("No Bearer");

    const payload = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

    req.uid = payload.uid;

    next();
  } catch (error) {
    console.log(error.message);

    const TokenVerificationErrors = {
      "invalid signature": "La firma del JWT no es válida",
      "jwt expired": "JWT expirado",
      "invalid token": "Token no valido",
      "No Bearer": "Utiliza formato Bearer",
      "jwt malformed": "JWT formato no valido",
    };

    return res
      .status(401)
      .json({ error: TokenVerificationErrors[error.message] });
  }
};
