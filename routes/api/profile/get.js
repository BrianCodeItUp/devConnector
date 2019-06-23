const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const Profile = require('../../../models/Profile')

/**
 * @route  Get api/profile
 * @desc   Get all profiles
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    res.json(profiles)
  } catch (e) {
    console.error('Error occured at get all profiles', e)
  }
})

/**
 * @route  Get api/profile/user/:user_id
 * @desc   Get profile by user ID
 * @access Public
 */
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile
      .findOne({ user: req.params.user_id })
      .populate('user', ['name', 'avatar'])

    if (!profile) return res.status(400).json({ msg: 'Profile Not found' })
    res.json(profile)
  } catch (e) {
    console.error('Error occured at get all profiles', e)
    e.kind === 'ObjectId'
      ? res.status(400).json({ msg: 'Profile Not found' })
      : res.status(500).json({ msg: 'Server Error' })
  }
})

/**
 * @route  Get api/profile/me
 * @desc   Get current users profile
 * @access Private
 */
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile
      .findOne({ user: req.user.id })
      .populate('user')
      .populate('user', ['name', 'avatar'])

    if (!profile) return res.status(400).json({ msg: 'There is no profile for this user' })
    res.json(profile)
  } catch (e) {
    console.error('Error occured at get user profile', e)
    res.status(500).send('Server Error')
  }
  res.send('Profile route')
})

module.exports = router
