const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/userController');

// מסלול לעמוד ההתחברות
router.get('/login', (req, res) => {
  res.render('pages/login'); // דואג לטעון את login.ejs מתיקיית pages
});


router.get('/signup', (req, res) => {
  res.render('pages/signup');
});


module.exports = router;
