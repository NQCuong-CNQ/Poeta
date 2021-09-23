var express = require("express")
var router = express.Router()
var mainController = require('../controllers/main-controller')

router.get("/", function (req, res) {
    res.render("index", {title: 'Home Page'})
})

router.get("/get-meals", mainController.getMeals)
router.get("/add-meals", mainController.addMeals)
router.post("/update-meals", mainController.updateMeals)
router.delete("/delete-meals", mainController.deleteMeals)

module.exports = router