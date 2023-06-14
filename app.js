// imports
const express = require('express');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const app = express();
const cors = require('cors')
const fileUpload = require('express-fileupload')
app.use (cors({ origin: '*'}))



//Middleware
app.use(express.json()) // ler json
app.use(cookieParser()) // ler cookies
app.use(fileUpload())
// import configs
config = require('./config')

// Use Routes
app.use('/users',require('./routes/users.router'))
app.use('/activities',require('./routes/activities.router'))
app.use('/badges',require('./routes/badges.router'))
app.use('/occurrences',require('./routes/occurrences.router'))
app.use('/rankings',require('./routes/ranking.router'))
app.use('/titles',require('./routes/titles.router'))
app.route('/').get(
  (req,res) => {
    res.send(app.routes)
})

//MONGO DB STUFF
const {connectToDb} = require('./mongo')

// server creation and listening for any incoming requests

const server = app.listen(config.port, config.hostname, async (error) => {
  
  await connectToDb()
  console.log(`App listening at http://${config.hostname}:${config.port}/`)
  
})

module.exports = {app,server}