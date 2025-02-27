const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const  authMiddleware  = require('../middleware/authMiddleware');
const {
  createWisata,
  getAllWisata,
  getWisataById,
  updateWisata,
  deleteWisata
} = require('../controllers/wisataController');

router.post(
  '/',
  authMiddleware,
  [
    body('namawisata').notEmpty().withMessage('Nama wisata is required'),
    body('hargaWisata').isInt().withMessage('Harga wisata must be an integer'),
    body('ratingWisata').isFloat().withMessage('Rating wisata must be a float'),
    body('lokasiwisata').notEmpty().withMessage('Lokasi wisata is required'),
    body('idCategory').isInt().withMessage('ID category must be an integer')
  ],
  createWisata
);

router.get('/', authMiddleware, getAllWisata);
router.get('/:id', authMiddleware, getWisataById);
router.put('/:id', authMiddleware, updateWisata);
router.delete('/:id', authMiddleware, deleteWisata);

module.exports = router;