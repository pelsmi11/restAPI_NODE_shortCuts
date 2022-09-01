import { Link } from "../models/Link.js";

export const redirectLink = async (req, res) => {
  try {
    const { nanoLink } = req.params;
    const link = await Link.findOne({ nanoLink });

    if (!link) return res.status(404).json({ error: "No existe el link" });

    return res.redirect(link.longLing);
  } catch (error) {
    console.log(error.message);
  }
};
