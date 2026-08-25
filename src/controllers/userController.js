const userService = require("../services/userService");
const { getProgress } = require("../utils/levelCalculator");
const prisma = require("../utils/prismaClient");

/**
 * @route  GET /api/users/leaderboard
 * @desc   Classement des utilisateurs par XP
 */
async function getLeaderboard(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 20;
    const leaderboard = await userService.getLeaderboard(limit);
    res.status(200).json({ success: true, count: leaderboard.length, leaderboard });
  } catch (error) {
    next(error);
  }
}

/**
 * @route  GET /api/users/:id
 * @desc   Profil public d'un utilisateur
 */
async function getUserProfile(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      select: {
        id: true,
        name: true,
        avatar: true,
        xp: true,
        level: true,
        role: true,
        createdAt: true,
        completions: {
          include: { quest: { select: { id: true, title: true, xpReward: true } } },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur introuvable." });
    }

    res.status(200).json({ success: true, user, progress: getProgress(user.xp) });
  } catch (error) {
    next(error);
  }
}

/**
 * @route  POST /api/users/avatar
 * @desc   Upload / mise à jour de l'avatar de l'utilisateur connecté
 */
async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Aucun fichier reçu." });
    }

    const avatarPath = `/uploads/${req.file.filename}`;
    const user = await userService.updateAvatar(req.user.id, avatarPath);

    res.status(200).json({
      success: true,
      message: "Avatar mis à jour.",
      avatar: user.avatar,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getLeaderboard, getUserProfile, uploadAvatar };
