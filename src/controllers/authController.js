const userService = require("../services/userService");
const generateToken = require("../utils/generateToken");
const { getProgress } = require("../utils/levelCalculator");

/**
 * @route  POST /api/auth/register
 * @desc   Inscription d'un nouvel utilisateur
 */
async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Merci de fournir un nom, un email et un mot de passe.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 6 caractères.",
      });
    }

    const user = await userService.createUser({ name, email, password, role });
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: "Compte créé avec succès.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        level: user.level,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route  POST /api/auth/login
 * @desc   Connexion d'un utilisateur existant
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Merci de fournir un email et un mot de passe.",
      });
    }

    const user = await userService.verifyCredentials(email, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect.",
      });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: "Connexion réussie.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        level: user.level,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route  GET /api/auth/me
 * @desc   Récupère le profil de l'utilisateur connecté
 */
async function getMe(req, res, next) {
  try {
    const progress = getProgress(req.user.xp);
    res.status(200).json({
      success: true,
      user: req.user,
      progress,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, getMe };
