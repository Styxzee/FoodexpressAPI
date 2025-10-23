import jwt from "jsonwebtoken";

/**
 * Vérifie le token JWT et ajoute req.user = { id, role }
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token invalide" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Toujours convertir en string pour éviter les problèmes ObjectId
    req.user = { id: decoded.id.toString(), role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
}

/**
 * Autorise si l'utilisateur est admin ou s'il agit sur son propre compte
 */
export function requireSelfOrAdmin(req, res, next) {
  if (req.user.role === "admin" || req.user.id === req.params.id.toString()) {
    return next();
  }
  return res.status(403).json({ error: "Accès interdit" });
}

/**
 * Autorise uniquement les admins
 */
export function requireAdmin(req, res, next) {
  if (req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ error: "Accès réservé aux administrateurs" });
}
