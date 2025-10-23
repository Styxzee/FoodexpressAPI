import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../db/models/user.js";
import { validate } from "../middlewares/validate.js";
import { userCreateSchema } from "./schemas.js";

const router = express.Router();

// POST /auth/signup — créer un compte (public)
router.post("/signup", validate(userCreateSchema, "body"), async (req, res) => {
  try {
    const { email, username, password, role } = req.body;

    // Vérifier si l'email existe déjà
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    // Hasher le mot de passe
    const hash = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await User.create({ email, username, password: hash, role });

    // Renvoyer l'utilisateur avec son _id
    res.status(201).json({
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /auth/login — connexion (public)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier que l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Identifiants invalides" });
    }

    // Vérifier le mot de passe
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: "Identifiants invalides" });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;