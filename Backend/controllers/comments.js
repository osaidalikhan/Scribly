const { StatusCodes } = require("http-status-codes");
const Comment = require("../models/Comment");

const getComments = async (req, res) => {
  const { blogId } = req.params;
  try {
    const comments = await Comment.getCommentsByBlogId(blogId);
    res.status(StatusCodes.OK).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || "Something went wrong." });
  }
};

const createComment = async (req, res) => {
  const { blogId } = req.params;
  const { content, parentCommentId } = req.body;
  const userId = req.user?.userId;

  if (!content || !content.trim()) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Comment content is required" });
  }

  try {
    const comment = await Comment.createComment({
      blogId,
      userId,
      content: content.trim(),
      parentCommentId,
    });
    res.status(StatusCodes.CREATED).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || "Something went wrong." });
  }
};

const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user?.userId;

  if (!content || !content.trim()) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Comment content is required" });
  }

  try {
    const comment = await Comment.getCommentById(id);
    if (!comment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Comment not found" });
    }
    if (comment.user_id !== userId) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "You can only edit your own comments" });
    }

    await Comment.updateComment(id, content.trim());
    res.status(StatusCodes.OK).json({ msg: "Comment updated successfully" });
  } catch (error) {
    console.error("Error updating comment:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || "Something went wrong." });
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    const comment = await Comment.getCommentById(id);
    if (!comment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Comment not found" });
    }
    if (comment.user_id !== userId) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "You can only delete your own comments" });
    }

    await Comment.deleteComment(id);
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.error("Error deleting comment:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || "Something went wrong." });
  }
};

module.exports = { getComments, createComment, updateComment, deleteComment };
