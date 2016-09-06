const KEYS = require('./constants')
const _ = require('./utils')
const redis = require("redis")
const client = redis.createClient()
 
client.on("error", (err) => console.log("Error " + err))

const data = {
  "id": 8620,
  "status": "New",
  "name": "Another Halal",
  "logo": "8690.gif",
  "rating": 42,
  "reviews": 1263,
  "cuisines": [],
  "coordinates": {
    "lat": 51.52571692211,
    "lng": -0.1171272876968
  },
  "distance": 2510,
  "recommended": 999994,
  "avg_price": 7,
  "opening_hours": {
    "slot_1": {
      "start": "2016-07-20T07:00:00+01:00",
      "end": "2016-07-20T23:00:00+01:00",
      "type": "C,D"
    }
  },
  "min_delivery_value": 0,
  "loyalty_stamps_need": 0,
  "loyalty_stamps_have": 0,
  "delivery_charge": 200,
  "delivery_charge_limit": 1200,
  "address": {
    "city": "Crouch End",
    "address": "66-68 Crouch End Hill",
    "zipcode": "N88AG",
    "phone": 2083416100
  },
  "sponsor": true,
  "payment_methods": {
    "cash": true,
    "card": true,
    "paypal": true
  },
  "Top500": true
}

const cuisines = [
  "All Night Alcohol",
  "American",
  "Balti",
  "Bangladeshi",
  "Breakfast",
  "Burgers & Chicken",
  "Cantonese",
  "Caribbean",
  "Charcoal Chicken",
  "Chinese",
  "Desserts",
  "Dim Sum",
  "Fish & Chips",
  "Gastro",
  "Greek",
  "Halal",
  "Indian",
  "Italian",
  "Japanese",
  "Jerk Chicken",
  "Kebab",
  "Korean",
  "Lebanese",
  "Malaysian",
  "Mexican",
  "Modern British",
  "Moroccan",
  "Nepalese",
  "Oriental",
  "Other",
  "Pakistani",
  "Peking",
  "Persian",
  "Pizza",
  "Russian",
  "Salads",
  "Sandwiches",
  "South Indian",
  "Sushi",
  "Thai",
  "Turkish",
  "Vegetarian",
  "Vietnamese"
]

const coords = {lng: -0.222812184852696, lat: 51.4808482449117}

const rand = (i = 32) => Math.random() * i | 0

const restObj = (i) => Object.assign({}, data, {
    id: i,
    name: "Restaurant " + i,
    avg_price: i / 2,
    coordinates: {lat: coords.lat + (i / 1000), lng: coords.lng - (i / 1000)},
    distance: rand(1000),
    rating: i + rand(),
    cuisines: [cuisines[rand()], cuisines[rand()]],
    min_delivery_value: i / 100,
    Top500: !(i % 2)
})

function save(i, done) {
    const rest = restObj(i)
    const multi = client.multi()

    !rest.min_delivery_value && multi.sadd(KEYS.FILTER_FREE_DELIVERY, i)
    !!rest.Top500 && multi.sadd(KEYS.FILTER_TOP_500, i)

    rest.cuisines.map(cuisine => multi.sadd(KEYS.FILTER_COUSINE + _.stripStr(cuisine), i))

    multi
        .sadd(KEYS.IDS, i)
        .set(KEYS.ID + i, JSON.stringify(rest))
        .set(KEYS.WEIGHT_NAME + i, rest.name)
        .set(KEYS.WEIGHT_REVIEWS + i, rest.rating)
        .set(KEYS.WEIGHT_DISTANCE + i, rest.distance)
        .exec((err, res) => {
            redis.print(err, res)
            i ? save(--i, done) : done()
        })
}

console.time('generating time')
save(process.argv[2] | 0 || 10, () => {
    console.timeEnd('generating time')
    client.quit()
})

