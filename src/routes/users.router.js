import express from "express";
import bcrypt from "bcrypt";
import User from "../db/models/user.js";
import { validate } from "../middlewares/validate.js";
import { requireAuth, requireSelfOrAdmin, requireAdmin } from "../middlewares/auth.js";
import { userUpdateSchema } from "./schemas.js";

const router = express.Router();

/**
 * GET /users/:id — lecture restreinte (auth, self ou admin)
 */
router.get("/:id", requireAuth, requireSelfOrAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "Introuvable" });

    res.status(200).json({
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /users/:id — mise à jour (auth, self ou admin)
 */
router.patch("/:id", requireAuth, requireSelfOrAdmin, validate(userUpdateSchema), async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select("-password");
    if (!user) return res.status(404).json({ error: "Introuvable" });

    res.status(200).json({
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /users/:id — suppression (admin uniquement)
 */
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "Introuvable" });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/** 
 * POST /users — création d’un utilisateur 
 */
router.post("/", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, username, password: hash, role: "user" });

    res.status(201).json({
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** 
 * GET /users — liste de tous les utilisateurs (admin uniquement) 
 */
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users.map(u => ({
      _id: u._id.toString(),
      email: u.email,
      username: u.username,
      role: u.role,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;