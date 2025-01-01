const express = require('express');
const router = express.Router();
const { sendUserMessage } = require('../controllers/producerController');

router.post('/', sendUserMessage); // הנתיב המוגדר: POST /produce/

module.exports = router;
