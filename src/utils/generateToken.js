const jwt = require("jsonwebtoken");

/**
 * Génère un token JWT signé pour un utilisateur donné.
 * @param {number} userId
 * @returns {string} token JWT
 */
function generateToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET manquant dans les variables d'environnement");
  }
  return jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

module.exports = generateToken;
