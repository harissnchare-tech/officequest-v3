const express = require("express");
const router = express.Router();
const {
  getLeaderboard,
  getUserProfile,
  uploadAvatar,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/leaderboard", protect, getLeaderboard);
router.get("/:id", protect, getUserProfile);
router.post("/avatar", protect, upload.single("avatar"), uploadAvatar);

module.exports = router;
