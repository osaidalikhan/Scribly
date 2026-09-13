const db = require("../db/connect"); // Your MySQL connection
const moment = require("moment");

// Shared SELECT fragment: base blog fields + author info + like/comment counts.
const BASE_SELECT = `
  SELECT
    blogs.*,
    users.id AS author_id,
    users.name AS author_name,
    users.email AS author_email,
    users.avatar AS author_avatar,
    (SELECT COUNT(*) FROM likes WHERE likes.blog_id = blogs.id) AS likes_count,
    (SELECT COUNT(*) FROM comments WHERE comments.blog_id = blogs.id) AS comments_count
  FROM blogs
  JOIN users ON blogs.user_id = users.id
`;

const Blog = {
  createBlog: ({ userId, title, description, image, category }) => {
    return new Promise((resolve, reject) => {
      const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
      const updatedAt = createdAt;

      const query = `
        INSERT INTO blogs (user_id, title, description, image, category, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        query,
        [userId, title, description, image, category, createdAt, updatedAt],
        (err, result) => {
          if (err) return reject(err);
          resolve({
            id: result.insertId,
            userId,
            title,
            description,
            image,
            category,
          });
        }
      );
    });
  },
  getAllBlogs: (filters) => {
    return new Promise((resolve, reject) => {
      let query = BASE_SELECT;
      const conditions = [];
      const params = [];

      if (filters?.search) {
        conditions.push(`blogs.title LIKE ?`);
        params.push(`%${filters.search}%`);
      }

      if (filters?.category && filters?.category !== "all") {
        conditions.push(`blogs.category = ?`);
        params.push(filters.category);
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      query += " ORDER BY blogs.created_at DESC";

      db.query(query, params, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Blogs written by the people `userId` follows — the personalized feed.
  getFeedBlogs: (followingIds) => {
    return new Promise((resolve, reject) => {
      if (!followingIds || followingIds.length === 0) {
        return resolve([]);
      }
      const placeholders = followingIds.map(() => "?").join(", ");
      const query = `${BASE_SELECT} WHERE blogs.user_id IN (${placeholders}) ORDER BY blogs.created_at DESC`;
      db.query(query, followingIds, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  getBlogsByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      const query = `${BASE_SELECT} WHERE blogs.user_id = ? ORDER BY blogs.created_at DESC`;
      db.query(query, [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  getBlogsByCategory: (category, excludeId) => {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT * FROM blogs 
      WHERE category = ? AND id != ?
      ORDER BY created_at DESC
      LIMIT 5
    `;
      db.query(query, [category, excludeId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  getBlogById: (id) => {
    return new Promise((resolve, reject) => {
      const query = `${BASE_SELECT} WHERE blogs.id = ?`;
      db.query(query, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  // Fire-and-forget style increment; callers don't need to await the result
  // to render the page, so this resolves regardless of a race between two
  // concurrent viewers.
  incrementViews: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE blogs SET views = views + 1 WHERE id = ?",
        [id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },

  deleteBlogById: (id) => {
    return new Promise((resolve, reject) => {
      db.query("DELETE FROM blogs WHERE id = ?", [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  updateBlog: (id, updates) => {
    return new Promise((resolve, reject) => {
      const { title, description, image, category } = updates;
      const updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
      const query = `
        UPDATE blogs
        SET title = ?, description = ?, image = ?, category = ?, updated_at = ?
        WHERE id = ?
      `;

      db.query(
        query,
        [title, description, image, category, updatedAt, id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },
};

module.exports = Blog;
