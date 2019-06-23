const express = require('express')
const connectDB = require('./config/db')
const app = express()
const profileRoutes = require('./routes/api/profile')

// Connect Database
connectDB()

// Init Middleware
app.use(express.json({ extended: false }))

app.get('/', (req, res) => res.send('API Running'))
const PORT = process.env.PORT || 5000

app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', profileRoutes)
app.use('/api/posts', require('./routes/api/posts'))
app.listen(PORT, () => console.log(`Server started at port ${PORT}`))
