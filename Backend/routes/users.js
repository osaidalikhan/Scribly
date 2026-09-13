const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFeed,
} = require("../controllers/users");
const authMiddleware = require("../middleware/authentication");
const optionalAuth = require("../middleware/optional-authentication");
const upload = require("../middleware/multer");

// Feed must be declared before "/:id" so it isn't swallowed by that param route.
router.get("/feed", authMiddleware, getFeed);

router.get("/:id", optionalAuth, getProfile);
router.patch("/me/profile", authMiddleware, upload.single("avatar"), updateProfile);

router.post("/:id/follow", authMiddleware, followUser);
router.delete("/:id/follow", authMiddleware, unfollowUser);
router.get("/:id/followers", getFollowers);
router.get("/:id/following", getFollowing);

module.exports = router;
