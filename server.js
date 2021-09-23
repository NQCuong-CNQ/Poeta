const fs = require('fs')
const express = require("express")
const app = express()
const http = require("http")
var mainRoute = require('./routers/main-router')

//create server using certificate
// var server = https.createServer({
//   cert: fs.readFileSync("./ssl/fullchain.pem"),
//   key: fs.readFileSync("./ssl/privkey.pem"),
// }, app)

var server = http.createServer(app)

//using ejs view engine
app.set('view engine', 'ejs')

//change views directory
app.set('views', __dirname + '/public/views/')
app.use(express.static("public"))

//add route
app.use('/', mainRoute)

//send CORS header
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header('Access-Control-Allow-Methods', '*')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  if ('OPTIONS' == req.method) {
    res.sendStatus(200)
  }
  else {
    next()
  }
})

//listen on port 443 to run ssl
server.listen(80)