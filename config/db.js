const mongoose = require('mongoose')
const key = require('./keys')

const connectDB = async () => {
  try {
    console.log('connecting DB...')
    await mongoose.connect(key.mongoURL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    console.log('DB connected')
  } catch (e) {
    console.error('Error occured at connectDB:', e)
    // Exit process with failure
    process.exit(1)
  }
}

module.exports = connectDB
