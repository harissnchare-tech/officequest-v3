const bcrypt = require("bcryptjs");
const prisma = require("../utils/prismaClient");
const { calculateLevel } = require("../utils/levelCalculator");

/**
 * Crée un nouvel utilisateur avec mot de passe hashé
 */
async function createUser({ name, email, password, role }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const error = new Error("Un compte existe déjà avec cet email.");
    error.statusCode = 409;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role === "ADMIN" ? "ADMIN" : "EMPLOYEE",
    },
  });

  return user;
}

/**
 * Vérifie les identifiants d'un utilisateur (email + mot de passe)
 */
async function verifyCredentials(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  return user;
}

/**
 * Récupère le classement des utilisateurs (leaderboard), trié par XP décroissant
 */
async function getLeaderboard(limit = 20) {
  const users = await prisma.user.findMany({
    orderBy: { xp: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      xp: true,
      level: true,
      avatar: true,
      role: true,
    },
  });
  return users;
}

/**
 * Ajoute de l'XP à un utilisateur et recalcule son niveau
 */
async function addXpToUser(userId, xpAmount) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const error = new Error("Utilisateur introuvable.");
    error.statusCode = 404;
    throw error;
  }

  const newXp = user.xp + xpAmount;
  const newLevel = calculateLevel(newXp);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { xp: newXp, level: newLevel },
  });

  return {
    user: updatedUser,
    leveledUp: newLevel > user.level,
  };
}

/**
 * Met à jour l'avatar d'un utilisateur
 */
async function updateAvatar(userId, avatarPath) {
  return prisma.user.update({
    where: { id: userId },
    data: { avatar: avatarPath },
  });
}

module.exports = {
  createUser,
  verifyCredentials,
  getLeaderboard,
  addXpToUser,
  updateAvatar,
};
