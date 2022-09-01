import { Router } from "express";
import {
  createLink,
  getLink,
  getLinks,
  removeLink,
  updateLink,
} from "../controllers/link.controller.js";
import { requireToken } from "../middlewares/requireToken.js";
import {
  bodyLinkValidator,
  paramLinkValidator,
} from "../middlewares/validatorManager.js";

const router = Router();

// GET          /api/v1/links           ALL LINKS
router.get("/", requireToken, getLinks);

// GET          /api/v1/links/:id       SINGLE LINK
router.get("/:nanoLink", getLink);
// POST         /api/v1/links           CREATE LINK
router.post("/", requireToken, bodyLinkValidator, createLink);
// PATCH/PUT    /api/v1/links/:id       UPDATE LINK
router.patch(
  "/:id",
  requireToken,
  paramLinkValidator,
  bodyLinkValidator,
  updateLink
);
// DELETE       /api/v1/links/:id       REMOVE LINK
router.delete("/:id", requireToken, paramLinkValidator, removeLink);

export default router;
