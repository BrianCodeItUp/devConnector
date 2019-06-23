const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../../middleware/auth')
const Profile = require('../../../models/Profile')
const { addExperienceFields } = require('../../utils/fields')
/**
 * @route  Put api/profile/experience
 * @desc   Add profile experience
 * @access Private
 */
router.put('/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    try {
      const profile = await Profile.findOne({ user: req.user.id })
      const profileData = req.body
      console.log('profileData', profileData)
      const experienceObj = addExperienceFields(profileData)
      profile.experience.unshift(experienceObj)
      await profile.save()
      res.json(profile)
    } catch (e) {
      console.error('Error occured at add experience:', e)
      res.status(500).send('Server Error')
    }
  })

module.exports = router
