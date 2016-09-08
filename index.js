const http = require('http')
const url = require('url')
const qs = require('qs')
const KEYS = require('./constants')
const _ = require('./utils')
const redis = require("redis")
const client = redis.createClient()

const filtersList = {
  cuisine: (val) => KEYS.FILTER_CUISINE + _.stripStr(val),
  delivery: () => KEYS.FILTER_FREE_DELIVERY,
  top500: () => KEYS.FILTER_TOP_500,
}

const allowedFilterKeys = Object.keys(filtersList)

const filter = (params = {}) => {
  const keys = Object.keys(params).filter(name => !!~allowedFilterKeys.indexOf(name))
  return !keys.length ? [KEYS.IDS] : keys.map(key => filtersList[key](params[key]))
}

const sortList = ({
  reviews: [KEYS.WEIGHT_REVIEWS + '*', 'DESC'],
  distance: [KEYS.WEIGHT_DISTANCE + '*'],
  alpha: [KEYS.WEIGHT_NAME + '*', 'ALPHA']
})

const sort = (key) => key in sortList ? ['BY', ...sortList[key]] : []

const responce = (data, url = '') => JSON.stringify({data: {
  type: 'restaurant-search',
  attributes: {total: data.length, restaurants: "RESTS"},
  links: {self: url}
}}).replace('"RESTS"', `[${data.join(',')}]`)

http.createServer((req, res) => {
  const params = url.parse(req.url)
  const query = qs.parse(params.query)

  if ('/' === params.pathname) {
    const filterComms = [KEYS.TMP, KEYS.LOC, ...filter(query.filters)]
    const sortComms = [KEYS.TMP, ...sort(query.sort), 'GET', KEYS.ID + '*']
    client.sadd(KEYS.LOC, Array.apply(null, {length: 100}).map((k, i) => i))
    client.sinterstore(...filterComms, (err) => {
      client.sort(...sortComms, (err, list) => {
        client.del(KEYS.LOC)
        if (err) {
          res.writeHead(500)
          res.end(String(err))
        } else {
          res.writeHead(200, {'Content-Type': 'application/json'})
          res.end(responce(list, req.url))
        }
      })
    })
  } else {
    res.writeHead(404)
    res.end()
  }
}).listen(8081)
