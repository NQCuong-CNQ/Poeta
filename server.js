const express = require("express")
const app = express()
const http = require("http")

// var server = http.createServer(app)

app.get('/', (req, res) => {
  res.send({ message: 'Hello WWW!' });
});

app.listen(80, () => {
  console.log('Application listening on port 3333!');
});