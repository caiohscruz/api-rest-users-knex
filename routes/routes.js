const express = require("express")
const app = express();
const router = express.Router();
const UserController = require("../controllers/UserController");
const PasswordTokenController = require("../controllers/PasswordTokenController");
const AdminAuth =  require("../middleware/AdminAuth");

router.get('/user', UserController.index);

router.get('/user/:id', UserController.findUser);

router.post("/user", UserController.create);

router.put("/user", AdminAuth, UserController.edit);

router.delete("/user/:id", AdminAuth, UserController.remove);

router.post("/recoverpassword", PasswordTokenController.recoverPassword);

router.put("/changepassword", UserController.changePassword);

router.post("/login", UserController.login);




module.exports = router;