import express from "express";
import Restaurant from "../db/models/restaurant.js";
import { validate } from "../middlewares/validate.js";
import { restaurantListSchema } from "./schemas.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";

const router = express.Router();

// GET /restaurants — public, tri + pagination
router.get("/", validate(restaurantListSchema), async (req, res) => {
  const { sort, order, limit, page } = req.query;
  const items = await Restaurant.find()
    .sort({ [sort]: order === "asc" ? 1 : -1 })
    .limit(limit)
    .skip((page - 1) * limit);
  res.status(200).json(items);
});

// POST /restaurants — admin
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const r = await Restaurant.create(req.body);
  res.status(201).json(r);
});

// PATCH /restaurants/:id — admin
router.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  const r = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!r) return res.status(404).json({ error: "Introuvable" });
  res.status(200).json(r);
});

// DELETE /restaurants/:id — admin
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const r = await Restaurant.findByIdAndDelete(req.params.id);
  if (!r) return res.status(404).json({ error: "Introuvable" });
  res.status(204).send();
});

export default router;