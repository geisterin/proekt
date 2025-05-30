const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
  console.log('📁 Файл загружен:', req.file);
  res.json({ 
    path: `/uploads/${req.file.filename}`,
    message: 'Файл успешно загружен'
  });
});

module.exports = router; 