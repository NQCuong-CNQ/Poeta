// const MongoClient = require('mongodb').MongoClient
// const url = "mongodb://localhost:27017/trackingdb"
// var clientDB
// var dbo

module.exports.getMeals = async function (req, res) {
    try {
        // clientDB = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        // dbo = clientDB.db("trackingdb")

        // let lastUpdated = await dbo.collection("log").find().sort({ $natural: -1 }).limit(1).toArray()



        // res.send({
        //     lastUpdated: lastUpdated[0].updateHistory
        // })
    } catch (err) {
        // console.log(err)
        res.send({
            message: err,
        })
    }
}