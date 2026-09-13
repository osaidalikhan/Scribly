const db = require("../db/connect");
const moment = require("moment");

const Like = {
  likeBlog: (blogId, userId) => {
    return new Promise((resolve, reject) => {
      const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
      const query = `INSERT IGNORE INTO likes (blog_id, user_id, created_at) VALUES (?, ?, ?)`;
      db.query(query, [blogId, userId, createdAt], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  unlikeBlog: (blogId, userId) => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM likes WHERE blog_id = ? AND user_id = ?`;
      db.query(query, [blogId, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  hasUserLiked: (blogId, userId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT 1 FROM likes WHERE blog_id = ? AND user_id = ? LIMIT 1`;
      db.query(query, [blogId, userId], (err, results) => {
        if (err) return reject(err);
        resolve(results.length > 0);
      });
    });
  },

  getLikeCount: (blogId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT COUNT(*) AS count FROM likes WHERE blog_id = ?`;
      db.query(query, [blogId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0].count);
      });
    });
  },
};

module.exports = Like;
