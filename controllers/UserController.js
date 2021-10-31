const User = require("../models/User");
const validator = require('validator');
const PasswordToken = require("../models/PasswordToken");
var jwt = require('jsonwebtoken');

var secret  = "adasdafafsdfagsdg";

class UserController {
  async index(req, res) {
    var users = await User.findAll();
    res.json(users);
  }

  async findUser(req, res) {
    var id = req.params.id;
    var user = await User.findById(id);
    if (user == undefined) {
      res.status(404);
      res.json({});
    } else {
      res.status(200);
      res.json(user);
    }
  }

  async create(req, res) {
    var {
      name,
      email,
      password
    } = req.body;

    if (name == undefined) {
      res.status(400);
      res.send({
        err: "name não enviado"
      });
      return;
    }

    if (email == undefined) {
      res.status(400);
      res.send({
        err: "email não enviado"
      });
      return;
    }

    if (!validator.isEmail(email)) {
      res.status(400);
      res.send({
        err: "email em formato inválido"
      });
      return;
    }

    if (password == undefined) {
      res.status(400);
      res.send({
        err: "password não enviado"
      });
      return;
    }

    var emailExists = await User.findEmail(email);

    if (emailExists) {
      res.status(406);
      res.json({
        err: "email já cadastrado"
      });
      return;
    }

    var userCreated = await User.new(name, email, password);

    if (userCreated) {
      res.status(200);
      res.send("Usuário cadastrado");
    } else {
      res.status(500);
      res.send("Houve algum problema interno");
    }
  }

  async edit(req, res) {
    var {
      id,
      name,
      email,
      role
    } = req.body;

    var result = await User.update(id, name, email, role);

    if (result != undefined) {
      if (result.status == true) {
        res.status(200);
        res.send("Editado com sucesso");
      } else {
        res.status(406);
        res.send(result.err);
      }
    } else {
      res.status(406);
      res.send("Ocorreu um erro no servidor");
    }
  }

  async remove(req, res) {
    var id = req.params.id;
    var result = await User.delete(id);

    if (result.status == true) {
      res.status(200);
      res.send("Deletado com sucesso");
    } else {
      res.status(406);
      res.send(result.err);
    }
  }
  async changePassword(req, res){
    var {token, password} = req.body;

    var tokenValidation = await PasswordToken.validate(token);

    if(tokenValidation.status==true){
      var userId = tokenValidation.token.user_id;
      var result = await User.updatePassword(userId, password);
      if (result.status == true) {
        var tokenId = tokenValidation.token.id;
        PasswordToken.setUsed(tokenId);
        res.status(200);
        res.send("Senha alterada com sucesso");
      } else {
        res.status(406);
        res.send(result.err);
      }
    }else{
      res.status(403);
      res.send(tokenValidation.err)
    }
  }
}

module.exports = new UserController();