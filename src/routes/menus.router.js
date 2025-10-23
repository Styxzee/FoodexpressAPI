import express from "express";
import Menu from "../db/models/menu.js";
import { validate } from "../middlewares/validate.js";
import { menuListSchema } from "./schemas.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";

const router = express.Router();

// GET /menus — public, tri + pagination
router.get("/", validate(menuListSchema), async (req, res) => {
  const { sort, order, limit, page } = req.query;
  const items = await Menu.find()
    .sort({ [sort]: order === "asc" ? 1 : -1 })
    .limit(limit)
    .skip((page - 1) * limit);
  res.status(200).json(items);
});

// POST /menus — admin
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const m = await Menu.create(req.body);
  res.status(201).json(m);
});

// PATCH /menus/:id — admin
router.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  const m = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!m) return res.status(404).json({ error: "Introuvable" });
  res.status(200).json(m);
});

// DELETE /menus/:id — admin
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const m = await Menu.findByIdAndDelete(req.params.id);
  if (!m) return res.status(404).json({ error: "Introuvable" });
  res.status(204).send();
});

export default router;