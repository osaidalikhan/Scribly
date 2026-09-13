const mysql = require("mysql2");

const { DB_HOST, DB_USER, DB_NAME } = process.env;

// Connect without specifying DB to create it if not exists
const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  // password: process.env.DB_PASSWORD,
});

// Connect and create DB if needed
connection.connect((err) => {
  if (err) {
    console.error("Initial MySQL connection failed:", err.message);
    process.exit(1);
  }
  console.log("Connected to MySQL server...");

  connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``, (err) => {
    if (err) {
      console.error("Database creation failed:", err.message);
      process.exit(1);
    }
    console.log(`Database "${DB_NAME}" is ready.`);

    // Close initial connection
    connection.end();
  });
});

// Now create connection to the specific database
const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  database: DB_NAME,
  // password: process.env.DB_PASSWORD,
});

// Adds a column to a table only if it doesn't already exist.
// Needed because MySQL (pre-8.0.29) has no `ADD COLUMN IF NOT EXISTS`.
const addColumnIfMissing = (table, column, definition) => {
  const checkQuery = `
    SELECT COUNT(*) AS count
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?
  `;
  db.query(checkQuery, [DB_NAME, table, column], (err, results) => {
    if (err) {
      console.error(`Failed checking column ${table}.${column}:`, err.message);
      return;
    }
    if (results[0].count > 0) return;

    db.query(`ALTER TABLE ${table} ADD COLUMN ${definition}`, (alterErr) => {
      if (alterErr) {
        console.error(`Failed adding column ${table}.${column}:`, alterErr.message);
        return;
      }
      console.log(`Added column ${table}.${column}.`);
    });
  });
};

db.connect((err) => {
  if (err) {
    console.error("MySQL connection to DB failed:", err.message);
    process.exit(1);
  }
  console.log(`✅ Connected to database "${DB_NAME}"`);

  // Create 'users' table if not exists
  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;
  db.query(createUsersTableQuery, (err) => {
    if (err) {
      console.error("Failed to create users table:", err.message);
      process.exit(1);
    }
    console.log("✅ Users table is ready.");

    // Profile fields added on top of the original users table
    addColumnIfMissing("users", "avatar", "avatar VARCHAR(255) DEFAULT NULL");
    addColumnIfMissing("users", "bio", "bio VARCHAR(500) DEFAULT NULL");
  });

  // Create 'blogs' table if not exists
  const createBlogsTableQuery = `
    CREATE TABLE IF NOT EXISTS blogs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      image VARCHAR(255),
      category VARCHAR(100) NOT NULL,
      created_at DATETIME NOT NULL,
      updated_at DATETIME NOT NULL
      -- You can add FOREIGN KEY (user_id) if you have users table
    )
  `;
  db.query(createBlogsTableQuery, (err) => {
    if (err) {
      console.error("Failed to create blogs table:", err.message);
      process.exit(1);
    }
    console.log("Blogs table is ready.");

    // View counter added on top of the original blogs table
    addColumnIfMissing("blogs", "views", "views INT NOT NULL DEFAULT 0");
  });

  // Comments on blogs (one level of replies via parent_comment_id)
  const createCommentsTableQuery = `
    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      blog_id INT NOT NULL,
      user_id INT NOT NULL,
      parent_comment_id INT DEFAULT NULL,
      content VARCHAR(1000) NOT NULL,
      created_at DATETIME NOT NULL,
      updated_at DATETIME NOT NULL,
      INDEX idx_comments_blog (blog_id),
      INDEX idx_comments_parent (parent_comment_id)
    )
  `;
  db.query(createCommentsTableQuery, (err) => {
    if (err) {
      console.error("Failed to create comments table:", err.message);
      return;
    }
    console.log("✅ Comments table is ready.");
  });

  // Likes on blogs — one like per user per blog
  const createLikesTableQuery = `
    CREATE TABLE IF NOT EXISTS likes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      blog_id INT NOT NULL,
      user_id INT NOT NULL,
      created_at DATETIME NOT NULL,
      UNIQUE KEY unique_like (blog_id, user_id),
      INDEX idx_likes_blog (blog_id),
      INDEX idx_likes_user (user_id)
    )
  `;
  db.query(createLikesTableQuery, (err) => {
    if (err) {
      console.error("Failed to create likes table:", err.message);
      return;
    }
    console.log("✅ Likes table is ready.");
  });

  // Follows — who follows whom
  const createFollowsTableQuery = `
    CREATE TABLE IF NOT EXISTS follows (
      id INT AUTO_INCREMENT PRIMARY KEY,
      follower_id INT NOT NULL,
      following_id INT NOT NULL,
      created_at DATETIME NOT NULL,
      UNIQUE KEY unique_follow (follower_id, following_id),
      INDEX idx_follows_follower (follower_id),
      INDEX idx_follows_following (following_id)
    )
  `;
  db.query(createFollowsTableQuery, (err) => {
    if (err) {
      console.error("Failed to create follows table:", err.message);
      return;
    }
    console.log("✅ Follows table is ready.");
  });
});

module.exports = db;
// DB_HOST=127.0.0.1
// DB_USER=root
// DB_PASSWORD=12345678
// PORT=3306
// JWT_SECRET=BLOG_PROJECT
// JWT_LIFETIME=1d
// DB_NAME=BLOGS
