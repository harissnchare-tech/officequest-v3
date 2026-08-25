/**
 * levelCalculator.js
 * Logique de progression (XP -> Niveau) pour HARISS OfficeQuest V3.
 *
 * Règle : chaque niveau nécessite 100 XP de plus que le précédent
 * (progression simple et lisible, facile à ajuster plus tard).
 *
 * Niveau 1 : 0 - 99 XP
 * Niveau 2 : 100 - 249 XP
 * Niveau 3 : 250 - 449 XP
 * ... etc (palier = 100 * niveau XP supplémentaires par niveau)
 */

const BASE_XP = 100;
const XP_STEP = 50;

/**
 * Calcule le total d'XP nécessaire pour ATTEINDRE un niveau donné.
 * @param {number} level
 * @returns {number} XP cumulé requis
 */
function xpRequiredForLevel(level) {
  if (level <= 1) return 0;
  let total = 0;
  for (let lvl = 1; lvl < level; lvl++) {
    total += BASE_XP + (lvl - 1) * XP_STEP;
  }
  return total;
}

/**
 * Détermine le niveau correspondant à un total d'XP donné.
 * @param {number} xp
 * @returns {number} niveau
 */
function calculateLevel(xp) {
  let level = 1;
  while (xp >= xpRequiredForLevel(level + 1)) {
    level += 1;
    if (level > 999) break; // garde-fou
  }
  return level;
}

/**
 * Donne des informations complètes de progression pour un total d'XP.
 * @param {number} xp
 * @returns {{level:number, xp:number, currentLevelXp:number, xpForNextLevel:number, progressPercent:number}}
 */
function getProgress(xp) {
  const level = calculateLevel(xp);
  const currentLevelBase = xpRequiredForLevel(level);
  const nextLevelBase = xpRequiredForLevel(level + 1);
  const currentLevelXp = xp - currentLevelBase;
  const xpForNextLevel = nextLevelBase - currentLevelBase;
  const progressPercent = Math.min(
    100,
    Math.round((currentLevelXp / xpForNextLevel) * 100)
  );

  return {
    level,
    xp,
    currentLevelXp,
    xpForNextLevel,
    progressPercent,
  };
}

module.exports = {
  calculateLevel,
  xpRequiredForLevel,
  getProgress,
};
