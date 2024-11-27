const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/producerController');

router.post('/', sendMessage); // הנתיב המוגדר: POST /produce/

module.exports = router;
