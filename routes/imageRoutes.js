const express = require('express');
const { analyzeImageController } = require('../controllers/imageController');

const router = express.Router();

router.post('/', analyzeImageController);

module.exports = router;
