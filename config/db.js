const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("users.db");

db.serialize(() => {


  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      isVerif INTEGER DEFAULT 0,
      otp TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      image TEXT NOT NULL,
      createdAt DATE DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATE DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS wisata (
      idwisata INTEGER PRIMARY KEY AUTOINCREMENT,
      namawisata VARCHAR(255) NOT NULL,
      gambarwisata VARCHAR(255),
      hargaWisata INTEGER,
      ratingWisata FLOAT,
      lokasiwisata VARCHAR(255),
      deskripsi TEXT,
      isFav BOOLEAN,
      Gallery TEXT,
      idCategory INTEGER,
      createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updateAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (idCategory) REFERENCES category(id)
    )
  `);
});

module.exports = db;