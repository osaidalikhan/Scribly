const express = require("express");
const router = express.Router();
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/comments");
const authMiddleware = require("../middleware/authentication");

// Reading comments is public; writing/editing/deleting requires a login.
router.get("/blog/:blogId", getComments);
router.post("/blog/:blogId", authMiddleware, createComment);
router.patch("/:id", authMiddleware, updateComment);
router.delete("/:id", authMiddleware, deleteComment);

module.exports = router;
