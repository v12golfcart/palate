CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  instagram_user_id TEXT,
  instagram_username TEXT,
  instagram_access_token TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
