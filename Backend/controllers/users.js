const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const Follow = require("../models/Follow");
const Blog = require("../models/Blog");

const getProfile = async (req, res) => {
  const { id } = req.params;
  const viewerId = req.user?.userId;

  try {
    const profile = await User.getUserProfile(id, viewerId);
    if (!profile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }
    res.status(StatusCodes.OK).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || "Something went wrong." });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.user?.userId;
  const { name, bio } = req.body;
  const avatar = req.file?.filename;

  try {
    await User.updateProfile(userId, { name, bio, avatar });
    const profile = await User.getUserProfile(userId, userId);
    res.status(StatusCodes.OK).json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || "Something went wrong." });
  }
};

const followUser = async (req, res) => {
  const { id } = req.params;
  const followerId = req.user?.userId;

  try {
    await Follow.followUser(followerId, id);
    res.status(StatusCodes.OK).json({ msg: "Followed successfully" });
  } catch (error) {
    console.error("Error following user:", error);
    const status =
      error.message === "You cannot follow yourself"
        ? StatusCodes.BAD_REQUEST
        : StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json({ error: error.message || "Something went wrong." });
  }
};

const unfollowUser = async (req, res) => {
  const { id } = req.params;
  const followerId = req.user?.userId;

  try {
    await Follow.unfollowUser(followerId, id);
    res.status(StatusCodes.OK).json({ msg: "Unfollowed successfully" });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || "Something went wrong." });
  }
};

const getFollowers = async (req, res) => {
  const { id } = req.params;
  try {
    const followers = await Follow.getFollowers(id);
    res.status(StatusCodes.OK).json(followers);
  } catch (error) {
    console.error("Error fetching followers:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || "Something went wrong." });
  }
};

const getFollowing = async (req, res) => {
  const { id } = req.params;
  try {
    const following = await Follow.getFollowing(id);
    res.status(StatusCodes.OK).json(following);
  } catch (error) {
    console.error("Error fetching following:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || "Something went wrong." });
  }
};

// Personalized feed: posts from everyone the logged-in user follows.
const getFeed = async (req, res) => {
  const userId = req.user?.userId;
  try {
    const followingIds = await Follow.getFollowingIds(userId);
    const blogs = await Blog.getFeedBlogs(followingIds);
    res.status(StatusCodes.OK).json(blogs);
  } catch (error) {
    console.error("Error fetching feed:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || "Something went wrong." });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFeed,
};
