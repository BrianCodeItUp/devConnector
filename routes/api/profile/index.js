const getProfileRouter = require('./get')
const postProfileRouter = require('./post')
const deleteProfileRouter = require('./delete')
const putProfileRouter = require('./put')

module.exports = [
  getProfileRouter,
  postProfileRouter,
  deleteProfileRouter,
  putProfileRouter
]
