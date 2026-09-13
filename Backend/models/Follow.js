const db = require("../db/connect");
const moment = require("moment");

const Follow = {
  // Follow a user. Silently no-ops (via INSERT IGNORE) if already following,
  // so double-clicks/re-submits don't throw a duplicate-key error.
  followUser: (followerId, followingId) => {
    return new Promise((resolve, reject) => {
      if (Number(followerId) === Number(followingId)) {
        return reject(new Error("You cannot follow yourself"));
      }
      const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
      const query = `
        INSERT IGNORE INTO follows (follower_id, following_id, created_at)
        VALUES (?, ?, ?)
      `;
      db.query(query, [followerId, followingId, createdAt], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  unfollowUser: (followerId, followingId) => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM follows WHERE follower_id = ? AND following_id = ?`;
      db.query(query, [followerId, followingId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  isFollowing: (followerId, followingId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ? LIMIT 1`;
      db.query(query, [followerId, followingId], (err, results) => {
        if (err) return reject(err);
        resolve(results.length > 0);
      });
    });
  },

  getFollowers: (userId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT users.id, users.name, users.avatar, users.bio
        FROM follows
        JOIN users ON users.id = follows.follower_id
        WHERE follows.following_id = ?
        ORDER BY follows.created_at DESC
      `;
      db.query(query, [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  getFollowing: (userId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT users.id, users.name, users.avatar, users.bio
        FROM follows
        JOIN users ON users.id = follows.following_id
        WHERE follows.follower_id = ?
        ORDER BY follows.created_at DESC
      `;
      db.query(query, [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // IDs of the people a user follows — used to build their personalized feed.
  getFollowingIds: (userId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT following_id FROM follows WHERE follower_id = ?`;
      db.query(query, [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results.map((row) => row.following_id));
      });
    });
  },
};

module.exports = Follow;
