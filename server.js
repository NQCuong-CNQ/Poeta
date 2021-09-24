const fs = require('fs')
const express = require("express")
const app = express()
// const https = require("https")
const http = require("http")

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

app.get("/", function (req, res) {
  res.render("index", { title: 'Home' })
})

//listen on port 443 to run ssl
server.listen(80)