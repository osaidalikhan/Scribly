const db = require("../db/connect");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const createUser = async ({ name, email, password }) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) return reject(err);
      resolve({ id: result.insertId, name, email, avatar: null, bio: null });
    });
  });
};

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

// Public profile: basic info + follower/following counts.
// `viewerId` (if provided) is used to flag whether the viewer already follows this user.
const getUserProfile = (id, viewerId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        users.id, users.name, users.email, users.avatar, users.bio, users.created_at,
        (SELECT COUNT(*) FROM follows WHERE following_id = users.id) AS followers_count,
        (SELECT COUNT(*) FROM follows WHERE follower_id = users.id) AS following_count,
        (SELECT COUNT(*) FROM blogs WHERE user_id = users.id) AS posts_count
        ${
          viewerId
            ? `, EXISTS(SELECT 1 FROM follows WHERE follower_id = ${db.escape(
                viewerId
              )} AND following_id = users.id) AS is_following`
            : ""
        }
      FROM users
      WHERE users.id = ?
    `;
    db.query(sql, [id], (err, results) => {
      if (err) return reject(err);
      const user = results[0];
      if (user) user.is_following = !!user.is_following;
      resolve(user);
    });
  });
};

const updateProfile = (id, { name, bio, avatar }) => {
  return new Promise((resolve, reject) => {
    const fields = [];
    const params = [];

    if (name !== undefined) {
      fields.push("name = ?");
      params.push(name);
    }
    if (bio !== undefined) {
      fields.push("bio = ?");
      params.push(bio);
    }
    if (avatar !== undefined) {
      fields.push("avatar = ?");
      params.push(avatar);
    }
    fields.push("updated_at = ?");
    params.push(moment().format("YYYY-MM-DD HH:mm:ss"));

    if (fields.length === 1) {
      // nothing besides updated_at was provided
      return resolve(null);
    }

    params.push(id);
    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const comparePassword = async (inputPassword, hashedPassword) => {
  return bcrypt.compare(inputPassword, hashedPassword);
};

const createToken = (user) => {
  return jwt.sign(
    { userId: user.id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

module.exports = {
  createUser,
  findUserByEmail,
  getUserProfile,
  updateProfile,
  comparePassword,
  createToken,
};
