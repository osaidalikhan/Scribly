const db = require("../db/connect");
const moment = require("moment");

const Comment = {
  createComment: ({ blogId, userId, content, parentCommentId }) => {
    return new Promise((resolve, reject) => {
      const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
      const query = `
        INSERT INTO comments (blog_id, user_id, parent_comment_id, content, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(
        query,
        [blogId, userId, parentCommentId || null, content, createdAt, createdAt],
        (err, result) => {
          if (err) return reject(err);
          resolve({
            id: result.insertId,
            blogId,
            userId,
            parentCommentId: parentCommentId || null,
            content,
            createdAt,
          });
        }
      );
    });
  },

  // Returns every comment for a blog, newest first, with the author's
  // name/avatar joined in. The frontend groups top-level comments and
  // replies (parent_comment_id) into a thread itself.
  getCommentsByBlogId: (blogId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT
          comments.id, comments.blog_id, comments.user_id, comments.parent_comment_id,
          comments.content, comments.created_at, comments.updated_at,
          users.name AS author_name, users.avatar AS author_avatar
        FROM comments
        JOIN users ON users.id = comments.user_id
        WHERE comments.blog_id = ?
        ORDER BY comments.created_at ASC
      `;
      db.query(query, [blogId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  getCommentCount: (blogId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT COUNT(*) AS count FROM comments WHERE blog_id = ?`;
      db.query(query, [blogId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0].count);
      });
    });
  },

  getCommentById: (id) => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM comments WHERE id = ?", [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  updateComment: (id, content) => {
    return new Promise((resolve, reject) => {
      const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
      const query = `UPDATE comments SET content = ?, updated_at = ? WHERE id = ?`;
      db.query(query, [content, updatedAt, id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  deleteComment: (id) => {
    return new Promise((resolve, reject) => {
      // Also drop replies to this comment so threads don't leave orphans.
      db.query(
        "DELETE FROM comments WHERE id = ? OR parent_comment_id = ?",
        [id, id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },
};

module.exports = Comment;
