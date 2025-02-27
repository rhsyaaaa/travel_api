const db = require('../config/db');
const { validationResult } = require('express-validator');

exports.createWisata = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { namawisata, gambarwisata, hargaWisata, ratingWisata, lokasiwisata, deskripsi, isFav, Gallery, idCategory } = req.body;

  db.run(
    `INSERT INTO wisata (namawisata, gambarwisata, hargaWisata, ratingWisata, lokasiwisata, deskripsi, isFav, Gallery, idCategory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [namawisata, gambarwisata, hargaWisata, ratingWisata, lokasiwisata, deskripsi, isFav, Gallery, idCategory],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error creating wisata', error: err.message });
      }
      res.status(201).json({ message: 'Wisata created successfully', id: this.lastID });
    }
  );
};

exports.getAllWisata = (req, res) => {
  db.all('SELECT * FROM wisata', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching wisata', error: err.message });
    }
    res.json(rows);
  });
};

exports.getWisataById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM wisata WHERE idwisata = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching wisata', error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Wisata not found' });
    }
    res.json(row);
  });
};

exports.updateWisata = (req, res) => {
  const { id } = req.params;
  const { namawisata, gambarwisata, hargaWisata, ratingWisata, lokasiwisata, deskripsi, isFav, Gallery, idCategory } = req.body;

  db.run(
    `UPDATE wisata SET namawisata = ?, gambarwisata = ?, hargaWisata = ?, ratingWisata = ?, lokasiwisata = ?, deskripsi = ?, isFav = ?, Gallery = ?, idCategory = ?, updateAt = CURRENT_TIMESTAMP WHERE idwisata = ?`,
    [namawisata, gambarwisata, hargaWisata, ratingWisata, lokasiwisata, deskripsi, isFav, Gallery, idCategory, id],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating wisata', error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Wisata not found' });
      }
      res.json({ message: 'Wisata updated successfully' });
    }
  );
};

exports.deleteWisata = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM wisata WHERE idwisata = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting wisata', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Wisata not found' });
    }
    res.json({ message: 'Wisata deleted successfully' });
  });
};