const jwt = require('jsonwebtoken');

// WARNING: Use a strong, secret key from environment variables in production
const JWT_SECRET = 'YOUR_SUPER_SECRET_KEY_REPLACE_ME';

/**
 * Creates a JWT token.
 * @param {object} payload - The user data to include in the token.
 * @returns {string} The JWT token.
 */
function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

/**
 * Verifies a JWT token.
 * @param {string} token - The JWT token.
 * @returns {object|null} The decoded payload or null if invalid.
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = { createToken, verifyToken };