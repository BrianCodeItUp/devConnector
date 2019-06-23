const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../../middleware/auth')
const Profile = require('../../../models/Profile')
const { addGeneralFields, addSocialFields } = require('../../utils/fields')

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

module.exports = router
