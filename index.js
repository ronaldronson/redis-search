const http = require('http')
const url = require('url')
const qs = require('qs')
const KEYS = require('./constants')
const redis = require("redis")

const client = redis.createClient()

http.createServer((req, res) => {
  const params = url.parse(req.url)
  const query = qs.parse(params.query)

  if ('/' === params.pathname) {
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify(query))
  } else {
    res.writeHead(404)
    res.end()
  }
}).listen(8081)

client.on("error", (err) => console.log("Error " + err))