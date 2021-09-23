const MongoClient = require('mongodb').MongoClient
const url = "mongodb://localhost:27017"
var clientDB
var dbo

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest

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

module.exports.addMeals = async function (req, res) {
    try {
        let mealName = req.query.mealName
        let response = await makeRequest("GET", `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(mealName)}`)
        let result = JSON.parse(response)
        // console.log(result.meals)
        if (result.meals == null) {

            console.log('ádfsdf')
            res.send({
                status: 0,
                data: null,
            })
            console.log('ádfsdf')
            return
        }

        let count = result.meals.length

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

module.exports.updateMeals = async function (req, res) {
    try {
        let mealName = req.query.mealName
        let oldName = req.query.oldMeal
        // console.log(mealName)
        let response = await makeRequest("GET", `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(mealName)}`)
        // console.log('response')
        let result = JSON.parse(response)
        // console.log(response)
        if (result.meals == null) {

            console.log('ádfsdf')
            res.send({
                status: 0,
                data: null,
            })
            console.log('ádfsdf')
            return
        }

        let count = result.meals.length

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

async function getTable() {
    let data = await dbo.collection("shopBlackList").find().toArray()
    return data
}