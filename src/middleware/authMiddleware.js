const jwt = require("jsonwebtoken");
const prisma = require("../utils/prismaClient");

/**
 * Protège une route : vérifie la présence et la validité du token JWT
 * envoyé dans l'en-tête Authorization: Bearer <token>
 */
async function protect(req, res, next) {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Accès refusé. Aucun token fourni.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        xp: true,
        level: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur introuvable pour ce token.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token invalide ou expiré.",
    });
  }
}

/**
 * Restreint l'accès aux utilisateurs ayant le rôle ADMIN
 */
function adminOnly(req, res, next) {
  if (req.user && req.user.role === "ADMIN") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Accès réservé aux administrateurs.",
  });
}

module.exports = { protect, adminOnly };
