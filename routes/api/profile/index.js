const getProfileRouter = require('./get')
const postProfileRouter = require('./post')
const deleteProfileRouter = require('./delete')
module.exports = [
  getProfileRouter,
  postProfileRouter,
  deleteProfileRouter
]
