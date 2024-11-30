const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES } = process.env;

// יצירת אסימון
const generateToken = (userId) => {
    const payload = { userId };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
};

// אימות אסימון
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

module.exports = { generateToken, verifyToken };
