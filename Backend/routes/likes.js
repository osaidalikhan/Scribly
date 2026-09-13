const express = require("express");
const router = express.Router();
const { toggleLike, getLikeStatus } = require("../controllers/likes");
const authMiddleware = require("../middleware/authentication");
const optionalAuth = require("../middleware/optional-authentication");

router.get("/:id", optionalAuth, getLikeStatus);
router.post("/:id/toggle", authMiddleware, toggleLike);

module.exports = router;
