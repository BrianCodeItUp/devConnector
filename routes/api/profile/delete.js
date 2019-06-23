const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const Profile = require('../../../models/Profile')
const User = require('../../../models/User')

/**
 * @route  Delete api/profile
 * @desc   Delete profile, uer & post
 * @access Private
 */
router.delete('/', auth, async (req, res) => {
  try {
    // TODO - remove user's posts

    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id })

    // Remove user
    await User.findOneAndRemove({ _id: req.user.id })

    res.json({ msg: 'user deleted' })
  } catch (e) {
    console.error('Error occured at delete profile, uer & post:', e)
  }
})

/**
 * @route  Delete api/profile/experience/:exp_id
 * @desc   Delete experience from profile
 * @access Private
 */
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    const { exp_id } = req.params
    // Get remove index
    const removeIndex = profile.experience.map(exp => exp.id).indexOf(exp_id)
    profile.experience.splice(removeIndex, 1)
    await profile.save()

    res.json(profile)
  } catch (e) {
    console.error('Error occured at delete user experience of a profile :', e)
  }
})

module.exports = router
