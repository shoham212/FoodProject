const { checkUser, createUser } = require('../models/userModel');
const bcrypt = require('bcryptjs');

const signup = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await checkUser(username);
        if (existingUser) {
            return res.status(400).send('שם המשתמש כבר קיים');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser(username, hashedPassword);
        res.send('ההרשמה בוצעה בהצלחה!');
    } catch (error) {
        console.error('שגיאה בהרשמה:', error);
        res.status(500).send('שגיאה בהרשמה');
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await checkUser(username);

        if (!user) {
            return res.status(400).send('שם המשתמש או הסיסמה אינם נכונים');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send('שם המשתמש או הסיסמה אינם נכונים');
        }

        res.send('התחברת בהצלחה!');
    } catch (error) {
        console.error('שגיאה בכניסה:', error);
        res.status(500).send('שגיאה בכניסה');
    }
};

module.exports = { signup, login };
