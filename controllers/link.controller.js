import { Link } from "../models/Link.js";
import { nanoid } from "nanoid";

export const getLinks = async (req, res) => {
  try {
    const links = await Link.find({ uid: req.uid });
    return res.json({ links });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "error de servidor", msg: error.message });
  }
};

export const getLink = async (req, res) => {
  try {
    const { nanoLink } = req.params;
    const link = await Link.findOne({ nanoLink });

    if (!link) return res.status(404).json({ error: "No existe el link" });

    return res.json({ longLink: link.longLing });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "error de servidor", msg: error.message });
  }
};
export const getLinkV1 = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await Link.findById(id);

    if (!link) return res.status(404).json({ error: "No existe el link" });

    if (!link.uid.equals(req.uid))
      return res.status(401).json({ error: "No le pertenece ese id" });

    return res.json({ link });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "error de servidor", msg: error.message });
  }
};

export const createLink = async (req, res) => {
  try {
    let { longLing } = req.body;
    // console.log(longLing);
    if (longLing.startsWith("http://")) {
      longLing = longLing.replace("http://", "https://");
    }
    if (!longLing.startsWith("https://")) {
      longLing = "https://" + longLing;
    }
    const link = new Link({ longLing, nanoLink: nanoid(6), uid: req.uid });
    const storedLink = await link.save();

    return res.status(201).json({ storedLink });
  } catch (error) {
    console.error(error);
    if (error.kind === "objectId") {
      return res
        .status(403)
        .json({ error: "Formato id incorrecto", msg: error.message });
    }
    return res
      .status(500)
      .json({ error: "error de servidor", msg: error.message });
  }
};

export const removeLink = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await Link.findById(id);

    if (!link) return res.status(404).json({ error: "No existe el link" });

    if (!link.uid.equals(req.uid))
      return res.status(401).json({ error: "No le pertenece ese id" });

    const linkRemove = await link.remove();

    return res.json({ linkRemove });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "error de servidor", msg: error.message });
  }
};

export const updateLink = async (req, res) => {
  try {
    const { id } = req.params;
    let { longLing } = req.body;
    if (longLing.startsWith("http://")) {
      longLing = longLing.replace("http://", "https://");
    }
    if (!longLing.startsWith("https://")) {
      longLing = "https://" + longLing;
    }
    const link = await Link.findById(id);

    if (!link) return res.status(404).json({ error: "No existe el link" });

    if (!link.uid.equals(req.uid))
      return res.status(401).json({ error: "No le pertenece ese id" });

    // actualizar
    link.longLing = longLing;
    const updateLink = await link.save();

    return res.json({ updateLink });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "error de servidor", msg: error.message });
  }
};
