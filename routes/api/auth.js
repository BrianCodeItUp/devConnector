const express = require('express')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const router = express.Router()
const authJwt = require('../../middleware/auth')
const User = require('../../models/User')
const keys = require('../../config/keys')

/**
 * @route  Get api/auth
 * @desc   auth route
 * @access Public
 */
router.get('/', authJwt, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select({ password: false })
    res.json(user)
  } catch (e) {
    console.error('Error error at login', e)
    res.status(500).send('Server error')
  }
  res.send('Auth route')
})

/**
 * @route  Post api/auth
 * @desc   Authenticate user & get token
 * @access Public
 */
router.post(
  '/',
  [
    check('email', 'Please inclue a valid email').isEmail(),
    check(
      'password',
      'Password is required'
    ).exists()
  ]
  , async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    try {
      const { email, password } = req.body
      let user = await User.findOne({ email })
      if (!user) return res.status(400).json({ errors: [{ msg: 'Invalid Credentials!!' }] })

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return res.status(400).json({ errors: 'Invalid Credentials' })

      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(
        payload,
        keys.jwtSecret,
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } catch (e) {
      console.error('Error occured at login user', e)
      res.status(500).send('Server error')
    }
  })

module.exports = router
