const fs = require('fs')
const express = require("express")
const app = express()
var cors = require('cors')
const https = require("https")
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
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


main()
async function main() {
  let result = await makeRequest("GET", 'https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata')
  console.log(result)
}



async function makeRequest(method, url) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === xhr.DONE) {
        let status = xhr.status
        if (status === 0 || (status >= 200 && status < 400)) {
          resolve(xhr.responseText)
        }
        else if (status === 404) {
          resolve(0)
        }
      }
    }
    xhr.send()
  })
}

server.listen(443)