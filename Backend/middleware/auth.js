const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from header
  
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
  
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Invalid token' });
      }
      
      req.user = decoded; // Add user info to request object
      next();
    });
  };

  module.exports = auth;