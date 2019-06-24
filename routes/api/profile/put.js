const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../../middleware/auth')
const Profile = require('../../../models/Profile')
const { addExperienceFields, addEducationFields } = require('../../utils/fields')

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
      const experienceObj = addExperienceFields(profileData)
      profile.experience.unshift(experienceObj)
      await profile.save()
      res.json(profile)
    } catch (e) {
      console.error('Error occured at add experience:', e)
      res.status(500).send('Server Error')
    }
  })

/**
 * @route  Put api/profile/education
 * @desc   Add profile education
 * @access Private
 */
router.put('/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    try {
      const profile = await Profile.findOne({ user: req.user.id })
      const profileData = req.body
      const educationObj = addEducationFields(profileData)
      profile.education.unshift(educationObj)
      await profile.save()
      res.json(profile)
    } catch (e) {
      console.error('Error occured at add education:', e)
      res.status(500).send('Server Error')
    }
  })

module.exports = router
