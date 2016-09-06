const KEYS = require('./constants')
const redis = require("redis")
const client = redis.createClient()
 
client.on("error", (err) => console.log("Error " + err))

const cousines = () => ['pizza', 'sushi', 'indian'][Math.random() * 3 | 0]

const restObj = (i) => ({
    id: i,
    name: "Restaurant " + i,
    delivery: Math.random() * 10 | 0,
    distance: Math.random() * 1000 | 0,
    reviews: Math.random() * 6 | 0,
    top500: !i%2,
    cousines: cousines()
})

function save(i, done) {
    const rest = restObj(i)
    const multi = client.multi()

    !rest.delivery && multi.sadd(KEYS.FILTER_FREE_DELIVERY, i)
    !!rest.top500 && multi.sadd(KEYS.FILTER_TOP_500, i)

    multi
        .sadd(KEYS.IDS, i)
        .sadd(KEYS.FILTER_COUSINE + rest.cousines, i)
        .set(i, JSON.stringify(rest))
        .set(KEYS.WEIGHT_DISTANCE + i, rest.distance)
        .set(KEYS.WEIGHT_REVIEWS + i, rest.reviews)
        .set(KEYS.WEIGHT_REVIEWS + i, rest.reviews)
        .exec((err, res) => {
            redis.print(err, res)
            i ? save(--i, done) : done()
        })
}

console.time('generating time')
save(10, () => client.quit())
console.timeEnd('generating time')
