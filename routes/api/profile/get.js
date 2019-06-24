const express = require('express')
const router = express.Router()
const request = require('request')
const auth = require('../../../middleware/auth')
const Profile = require('../../../models/Profile')
const keys = require('../../../config/keys')
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

/**
 * @route  Get api/profile/github/:username
 * @desc   Get user repos from Github
 * @access Public
 */
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=55&sort=created:asc&client_id=${keys.githubClientId}&client_secret=${keys.githubClientSecret}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    }

    request(options, (err, response, body) => {
      if (err) console.log(err)
      if (response.statusCode !== 200) res.status(400).json({ msg: 'No Github profile found' })
      res.json(JSON.parse(body))
    })
  } catch (e) {
    console.error('Error occured at get user Github repo', e)
    res.status(500).send('Server Error')
  }
})

module.exports = router
