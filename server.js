const fs = require('fs')
const express = require("express")
const app = express()
var cors = require('cors')
const https = require("https")

var mainRoute = require('./routers/main-router')

var server = https.createServer({
  cert: fs.readFileSync("./ssl/fullchain.pem"),
  key: fs.readFileSync("./ssl/privkey.pem"),
}, app)


app.set('view engine', 'ejs')
app.set('views', __dirname + '/public/views/')



app.use(express.static("public"))
app.use('/', mainRoute)

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

server.listen(443)