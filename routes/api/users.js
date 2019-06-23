const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const gravator = require('gravatar')
const bcrpt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const keys = require('../../config/keys')

/**
 * @route  Post api/users
 * @desc   Register user
 * @access Public
 */
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please inclue a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6  or more characters'
  ).isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  try {
    const { name, email, password } = req.body
    let user = await User.findOne({ email })
    if (user) return res.status(400).json({ errors: [{ msg: 'User already exists' }] })

    const avatar = gravator.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    })

    user = new User({
      name,
      email,
      avatar,
      password
    })

    const salt = await bcrpt.genSalt(10)
    user.password = await bcrpt.hash(password, salt)
    await user.save()

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
    console.error('Error occured at register user', e)
    res.status(500).send('Server error')
  }
})

module.exports = router
