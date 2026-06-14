const jwt = require('jsonwebtoken');
const config = require('../config');

const signToken = (payload) => {
  return jwt.sign(
    { userId: payload.userId, email: payload.email, role: payload.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

module.exports = {
  signToken,
  verifyToken
};
