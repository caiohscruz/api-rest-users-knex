const express = require("express")
const app = express();
const router = express.Router();
const UserController = require("../controllers/UserController");
const PasswordTokenController = require("../controllers/PasswordTokenController");
const HomeController = require("../controllers/HomeController");
const AdminAuth =  require("../middleware/AdminAuth");

router.get("/", HomeController.index);

router.post("/user", UserController.create);

router.get('/users', AdminAuth, UserController.index);

router.get('/user/:id', AdminAuth, UserController.findUser);

router.put("/user", AdminAuth, UserController.edit);

router.delete("/user/:id", AdminAuth, UserController.remove);

router.post("/recover-password", PasswordTokenController.recoverPassword);

router.put("/redefine-password", UserController.redefinePassword);

router.post("/validate-password-token", PasswordTokenController.validate);

router.post("/login", UserController.login);

router.post('/validate', AdminAuth, UserController.validate);


module.exports = router;