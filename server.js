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

app.use(cors())
app.options('*', cors())

app.use(express.static("public"))
app.use('/', mainRoute)

server.listen(80)