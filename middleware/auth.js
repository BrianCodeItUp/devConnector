const jwt = require('jsonwebtoken')
const keys = require('../config/keys')

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token')
  // Check if no token
  if (!token) return res.status(401).json({ msg: 'Authorization denied' })
  try {
    const decoded = jwt.verify(token, keys.jwtSecret)
    req.user = decoded.user
    next()
  } catch (e) {
    res.status(401).json({ msg: 'Token is not valid' })
  }
}
