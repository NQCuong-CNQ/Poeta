const MongoClient = require('mongodb').MongoClient
const url = "mongodb://localhost:27017"
var clientDB
var dbo
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest

//************************************
// Description: get all meal on database, return to client
//************************************
module.exports.getMeals = async function (req, res) {
    try {
        clientDB = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        dbo = clientDB.db("mealsDB")
        let data = await getTable()
        res.send({
            data: data
        })
    } catch (err) {
        console.log(err)
        res.send({
            message: err,
        })
    }
}

//************************************
// Description: make a request with parameter to API, if the response is null, return status 0 to client
// if not, count the length anh insert to database, get all data and return data to client
//************************************
module.exports.addMeals = async function (req, res) {
    try {
        let mealName = req.query.mealName
        let response = await makeRequest("GET", `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(mealName)}`)
        let result = JSON.parse(response)
        if (result.meals == null) {
            res.send({
                status: 0,
                data: null,
            })
            return
        }
        let count = result.meals.length

        // using update function for update meal if it exist already, if not it will act like insert function
        await dbo.collection("shopBlackList").updateOne({ mealName: mealName }, { $set: { mealName: mealName, count: count } }, { upsert: true })
        let data = await getTable()

        res.send({
            status: 1,
            data: data
        })
        
    } catch (err) {
        console.log(err)
        res.send({
            message: err,
        })
    }
}

//************************************
// Description: make a request with parameter to API, if the response is null, return status 0 to client
// if not, count the length anh update to database, get all data and return data to client
//************************************
module.exports.updateMeals = async function (req, res) {
    try {
        let mealName = req.query.mealName
        let oldName = req.query.oldMeal
        let response = await makeRequest("GET", `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(mealName)}`)
        let result = JSON.parse(response)
        if (result.meals == null) {
            res.send({
                status: 0,
                data: null,
            })
            return
        }

        let count = result.meals.length

        // using update function for update meal if it exist already, if not it will act like insert function
        await dbo.collection("shopBlackList").updateOne({ mealName: oldName }, { $set: { mealName: mealName, count: count } }, { upsert: true })
        let data = await getTable()

        res.send({
            status: 1,
            data: data
        })
    } catch (err) {
        console.log(err)
        res.send({
            message: err,
        })
    }
}


//************************************
// Description: delete on database with mealName, get all data and return data to client
//************************************
module.exports.deleteMeals = async function (req, res) {
    try {
        let mealName = req.query.mealName
        await dbo.collection("shopBlackList").deleteOne({ mealName: mealName })
        let data = await getTable()

        res.send({
            data: data
        })
    } catch (err) {
        console.log(err)
        res.send({
            message: err,
        })
    }
}


//************************************
// Description: This function used for make request to API, check status is ok and return 
// Parameter: method, url
//************************************
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

//************************************
// Description: get all data in database and return
// Parameter: 
//************************************
async function getTable() {
    let data = await dbo.collection("shopBlackList").find().toArray()
    return data
}