const express = require("express");
const router = express.Router();
const {
  getAllQuests,
  getQuestById,
  createQuest,
  updateQuest,
  deleteQuest,
  completeQuest,
} = require("../controllers/questController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, getAllQuests);
router.get("/:id", protect, getQuestById);
router.post("/", protect, adminOnly, createQuest);
router.put("/:id", protect, adminOnly, updateQuest);
router.delete("/:id", protect, adminOnly, deleteQuest);
router.post("/:id/complete", protect, completeQuest);

module.exports = router;
