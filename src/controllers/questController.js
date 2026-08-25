const questService = require("../services/questService");

/**
 * @route  GET /api/quests
 * @desc   Liste toutes les quêtes
 */
async function getAllQuests(req, res, next) {
  try {
    const quests = await questService.getAllQuests();
    res.status(200).json({ success: true, count: quests.length, quests });
  } catch (error) {
    next(error);
  }
}

/**
 * @route  GET /api/quests/:id
 * @desc   Détail d'une quête
 */
async function getQuestById(req, res, next) {
  try {
    const quest = await questService.getQuestById(req.params.id);
    if (!quest) {
      return res.status(404).json({ success: false, message: "Quête introuvable." });
    }
    res.status(200).json({ success: true, quest });
  } catch (error) {
    next(error);
  }
}

/**
 * @route  POST /api/quests
 * @desc   Crée une nouvelle quête (admin uniquement)
 */
async function createQuest(req, res, next) {
  try {
    const { title, description, xpReward, difficulty } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Le titre de la quête est obligatoire.",
      });
    }

    const quest = await questService.createQuest({
      title,
      description,
      xpReward,
      difficulty,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, message: "Quête créée avec succès.", quest });
  } catch (error) {
    next(error);
  }
}

/**
 * @route  PUT /api/quests/:id
 * @desc   Met à jour une quête (admin uniquement)
 */
async function updateQuest(req, res, next) {
  try {
    const { title, description, xpReward, difficulty, status } = req.body;
    const quest = await questService.updateQuest(req.params.id, {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(xpReward !== undefined && { xpReward }),
      ...(difficulty !== undefined && { difficulty }),
      ...(status !== undefined && { status }),
    });
    res.status(200).json({ success: true, message: "Quête mise à jour.", quest });
  } catch (error) {
    next(error);
  }
}

/**
 * @route  DELETE /api/quests/:id
 * @desc   Supprime une quête (admin uniquement)
 */
async function deleteQuest(req, res, next) {
  try {
    await questService.deleteQuest(req.params.id);
    res.status(200).json({ success: true, message: "Quête supprimée." });
  } catch (error) {
    next(error);
  }
}

/**
 * @route  POST /api/quests/:id/complete
 * @desc   Marque une quête comme complétée par l'utilisateur connecté
 */
async function completeQuest(req, res, next) {
  try {
    const result = await questService.completeQuest(req.user.id, req.params.id);
    res.status(200).json({
      success: true,
      message: result.leveledUp
        ? `Bravo ! Quête complétée et niveau supérieur atteint (niveau ${result.user.level}) !`
        : "Quête complétée avec succès.",
      xpGained: result.quest.xpReward,
      leveledUp: result.leveledUp,
      user: {
        id: result.user.id,
        xp: result.user.xp,
        level: result.user.level,
      },
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
}

module.exports = {
  getAllQuests,
  getQuestById,
  createQuest,
  updateQuest,
  deleteQuest,
  completeQuest,
};
