const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // ייבוא מודול jwt
const { createUser, getUserByUsername } = require('../dal/userDal');

// Register a new user
const signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'שם המשתמש כבר קיים במערכת' });
    }

    await createUser(username, password);
    res.status(201).json({ message: 'המשתמש נוצר בהצלחה' });
  } catch (error) {
    console.error('שגיאה ביצירת המשתמש:', error);
    res.status(500).json({ error: 'שגיאה ביצירת המשתמש' });
  }
};

// Login a user
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(404).json({ error: 'משתמש לא נמצא במערכת' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'הסיסמה שגויה' });
    }

    // יצירת אסימון JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username }, // תוכן האסימון
      process.env.JWT_SECRET, // מפתח סודי שנשמר ב-.env
      { expiresIn: '1h' } // זמן תפוגה של האסימון
    );

    res.status(200).json({
      message: 'התחברות בוצעה בהצלחה',
      token: token, // האסימון שנוצר
    });
  } catch (error) {
    console.error('שגיאה במהלך ההתחברות:', error);
    res.status(500).json({ error: 'שגיאה במהלך ההתחברות' });
  }
};

module.exports = { signup, login };
