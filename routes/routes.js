var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var UserController = require("../controllers/UserController");

router.get('/', HomeController.index);

router.get('/user', UserController.index);

router.get('/user/:email', UserController.findUser);

router.post("/user", UserController.create);

module.exports = router;