const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const _ = require('lodash')
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const Profile = require('../../models/Profile')
const fieldsConfig = require('../fieldsConfig')
const utils = require('../utils')
/**
 * @route  Get api/profile/me
 * @desc   Get current users profile
 * @access Private
 */
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile
      .findOne({ user: req.user.id })
      .populate('user').populate('user', ['name', 'avatar'])

    if (!profile) return res.status(400).json({ msg: 'There is no profile for this user' })
    res.json(profile)
  } catch (e) {
    console.error('Error occured at get user profile', e)
    res.status(500).send('Server Error')
  }
  res.send('Profile route')
})

/**
 * @route  Post api/profile
 * @desc   Create or update user profile
 * @access Private
 */
router.post('/', [
  auth,
  [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { body: profileData } = req

  // Build profile object
  const generalFieldsObj = addGeneralFields(profileData)
  const socialFieldObj = addSocialFields(profileData)

  const profileFields = {
    ...generalFieldsObj,
    social: { ...socialFieldObj }
  }
  profileFields.user = req.user.id

  try {
    const originalProfile = await Profile.findOne({ user: req.user.id })

    // Update
    if (originalProfile) {
      const UpdatedProfile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      )
      return res.json(UpdatedProfile)
    }

    // Create
    const newProfile = new Profile(profileFields)
    await newProfile.save()
    res.send(newProfile)
  } catch (e) {
    console.log('Error occured at update and create profile:', e)
  }
})

function addFields (fieldCongfig, profileData) {
  let fieldObj = {}
  _.forEach(fieldCongfig, (typeSpec, field) => {
    if (typeSpec !== null) {
      const { funcName } = typeSpec
      const func = utils[funcName]
      func ? fieldObj[field] = func() : console.log(`Utils Not Found: ${funcName}`)
    }
    if (profileData[field]) fieldObj[field] = profileData[field]
  })
  return { ...fieldObj }
}

const addGeneralFields = _.partial(addFields, fieldsConfig.GERNERL_FIELDS)
const addSocialFields = _.partial(addFields, fieldsConfig.SOCIAL_FIELDS)

module.exports = router
