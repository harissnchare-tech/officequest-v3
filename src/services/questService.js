const prisma = require("../utils/prismaClient");
const { addXpToUser } = require("./userService");

/**
 * Récupère toutes les quêtes, avec le nombre de complétions
 */
async function getAllQuests() {
  const quests = await prisma.quest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { completions: true } },
      creator: { select: { id: true, name: true } },
    },
  });
  return quests;
}

/**
 * Récupère une quête par son ID
 */
async function getQuestById(id) {
  return prisma.quest.findUnique({
    where: { id: Number(id) },
    include: { completions: true, creator: { select: { id: true, name: true } } },
  });
}

/**
 * Crée une nouvelle quête (réservé aux admins)
 */
async function createQuest({ title, description, xpReward, difficulty, createdBy }) {
  return prisma.quest.create({
    data: {
      title,
      description,
      xpReward: xpReward || 10,
      difficulty: difficulty || "EASY",
      createdBy,
    },
  });
}

/**
 * Met à jour une quête existante
 */
async function updateQuest(id, data) {
  return prisma.quest.update({
    where: { id: Number(id) },
    data,
  });
}

/**
 * Supprime une quête
 */
async function deleteQuest(id) {
  return prisma.quest.delete({ where: { id: Number(id) } });
}

/**
 * Marque une quête comme complétée par un utilisateur et attribue l'XP.
 * Empêche la double-complétion grâce à la contrainte unique (userId, questId).
 */
async function completeQuest(userId, questId) {
  const quest = await prisma.quest.findUnique({ where: { id: Number(questId) } });
  if (!quest) {
    const error = new Error("Quête introuvable.");
    error.statusCode = 404;
    throw error;
  }

  if (quest.status === "CLOSED") {
    const error = new Error("Cette quête est fermée.");
    error.statusCode = 400;
    throw error;
  }

  const alreadyDone = await prisma.completion.findUnique({
    where: { userId_questId: { userId, questId: Number(questId) } },
  });

  if (alreadyDone) {
    const error = new Error("Vous avez déjà complété cette quête.");
    error.statusCode = 409;
    throw error;
  }

  const completion = await prisma.completion.create({
    data: { userId, questId: Number(questId) },
  });

  const xpResult = await addXpToUser(userId, quest.xpReward);

  return { completion, ...xpResult, quest };
}

module.exports = {
  getAllQuests,
  getQuestById,
  createQuest,
  updateQuest,
  deleteQuest,
  completeQuest,
};
