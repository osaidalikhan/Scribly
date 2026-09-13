const { StatusCodes } = require("http-status-codes");
const Like = require("../models/Like");

// Toggle like/unlike for the logged-in user, and return the fresh state.
const toggleLike = async (req, res) => {
  const { id: blogId } = req.params;
  const userId = req.user?.userId;

  try {
    const alreadyLiked = await Like.hasUserLiked(blogId, userId);

    if (alreadyLiked) {
      await Like.unlikeBlog(blogId, userId);
    } else {
      await Like.likeBlog(blogId, userId);
    }

    const likesCount = await Like.getLikeCount(blogId);
    res.status(StatusCodes.OK).json({
      liked: !alreadyLiked,
      likesCount,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || "Something went wrong." });
  }
};

const getLikeStatus = async (req, res) => {
  const { id: blogId } = req.params;
  const userId = req.user?.userId;

  try {
    const [liked, likesCount] = await Promise.all([
      userId ? Like.hasUserLiked(blogId, userId) : Promise.resolve(false),
      Like.getLikeCount(blogId),
    ]);
    res.status(StatusCodes.OK).json({ liked, likesCount });
  } catch (error) {
    console.error("Error fetching like status:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || "Something went wrong." });
  }
};

module.exports = { toggleLike, getLikeStatus };
