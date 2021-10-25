const User = require("../models/User");
const validator = require('validator');

class UserController {
  async index(req, res) {
      var users = await User.findAll();
      res.json(users);
  }

  async findUser(req, res){
    var email = req.params.email;
    var user = await User.findByEmail(email);
    if(user == undefined){
      res.status(404);
      res.json({});
    }else{
      res.status(200);
      res.json(user);
    }
  }

  async create(req, res) {
    var { name, email, password } = req.body;

    if (name == undefined) {
      res.status(400);
      res.send({ err: "name não enviado" });
      return;
    }

    if (email == undefined) {
      res.status(400);
      res.send({ err: "email não enviado" });
      return;
    }

    if(!validator.isEmail(email)){
        res.status(400);
        res.send({ err: "email em formato inválido" });
        return;
    }

    if (password == undefined) {
      res.status(400);
      res.send({ err: "password não enviado" });
      return;
    }

    var emailExists = await User.findEmail(email);

    if (emailExists) {
      res.status(406);
      res.json({ err: "email já cadastrado" });
      return;
    }

    var userCreated = await User.new(name, email, password);

    if(userCreated){
        res.status(200);
        res.send("Usuário cadastrado");
    }else{
        res.status(500);
        res.send("Houve algum problema interno");
    }
  }
}

module.exports = new UserController();
