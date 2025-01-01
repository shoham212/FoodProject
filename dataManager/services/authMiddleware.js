const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.userId }; // ודא שיש userId בתוך האסימון
      next();
  } catch (error) {
      res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = { authenticateToken };
