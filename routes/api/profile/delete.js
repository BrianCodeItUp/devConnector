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
module.exports = router
