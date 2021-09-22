const express = require("express")
const app = express()
const http = require("http")

var mainRoute = require('./routers/main-router')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/public/views/')
app.use(express.static("public"))
app.use('/', mainRoute)

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header('Access-Control-Allow-Methods', '*')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, append,delete,entries,foreach,get,has,keys,set,values,Authorization")
  if ('OPTIONS' == req.method) {
    res.sendStatus(200)
  }
  else {
    next()
  }
})

app.listen(80, () => {
  console.log('Application listening on port 3333!');
});