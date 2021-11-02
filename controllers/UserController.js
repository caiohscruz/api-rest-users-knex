const User = require("../models/User");
const validator = require('validator');
const PasswordToken = require("../models/PasswordToken");

const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
require('dotenv/config');


var secret = process.env.SECRET;

class UserController {
  async index(req, res) {
    var users = await User.findAll();
    res.send(users);
  }

  async findUser(req, res) {
    var id = req.params.id;
    var user = await User.findById(id);
    if (user == undefined) {
      res.status(404);
      res.send({});
    } else {
      res.status(200);
      res.send(user);
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
      res.send("Nome de usuário não enviado");
      return;
    }

    if (name.trim() == '') {
      res.status(400);
      res.send("Nome de usuário em branco");
      return;
    }

    if (email == undefined) {
      res.status(400);
      res.send("Email não enviado");
      return;
    }

    if (!validator.isEmail(email)) {
      res.status(400);
      res.send("E-mail em formato inválido");
      return;
    }

    if (password == undefined) {
      res.status(400);
      res.send("Password não enviado");
      return;
    }

    if (password.trim() == '') {
      res.status(400);
      res.send("Password em branco");
      return;
    }

    var emailExists = await User.findByEmail(email);

    if (emailExists != undefined) {
      res.status(406);
      res.send("E-mail já cadastrado");
      return;
    }

    var userCreated = await User.new(name, email, password);

    if (userCreated.status == true) {
      res.status(200);
      res.send("Usuário cadastrado");
    } else {
      res.status(406);
      res.send(userCreated.err);
    }
  }

  async edit(req, res) {
    var {
      id,
      name,
      email,
      role
    } = req.body;

    var user = await User.findById(id);

    if (user == undefined) {
      res.status(404);
      res.send("Usuário não encontrado");
      return;
    }

    if (email != undefined && !validator.isEmail(email)) {
      res.status(400);
      res.send("E-mail em formato inválido");
      return;
    }

    if (email != undefined) {
      var emailExists = await User.findByEmail(email);

      if (emailExists != undefined) {
        if (emailExists.id != id) {
          res.status(406);
          res.send("E-mail já utilizado");
          return;
        }
      }
    }

    var result = await User.update(id, name, email, role);

    if (result.status == true) {
      res.status(200);
      res.send("Editado com sucesso");
    } else {
      res.status(406);
      res.send(result.err);
    }
  }

  async remove(req, res) {
    var id = req.params.id;
    console.log(id);
    var user = await User.findById(id);

    if (user == undefined) {
      res.status(404);
      res.send("Usuário não encontrado");
      return;
    }

    var result = await User.delete(id);

    if (result.status == true) {
      res.status(200);
      res.send("Deletado com sucesso");
    } else {
      res.status(406);
      res.send(result.err);
    }
  }

  async changePassword(req, res) {
    var {
      token,
      password
    } = req.body;

    var tokenValidation = await PasswordToken.validate(token);

    if (tokenValidation.status == true) {
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
    } else {
      res.status(403);
      res.send(tokenValidation.err);
    }
  }

  async login(req, res) {
    var {
      email,
      password
    } = req.body;

    var user = await User.findByEmail(email);

    if (user != undefined) {
      var result = await bcrypt.compare(password, user.password);
      if (result == true) {
        jwt.sign({
          id: user.id,
          username: user.username,
          role: user.role
        }, secret, {
          expiresIn: "2h"
        }, (err, token) => {
          if (err) {
            res.status(400);
            res.send("Falha interna");
          } else {
            res.status(200);
            res.send(token);
          }
        })
      } else {
        res.status(401);
        res.send("Combinação inválida de usuário e senha")
      }
    } else {
      res.status(404);
      res.send("Usuário não encontrado")
    }
  }
  async validate(req, res) {
    res.status(200);
    res.send("Autorizado");
  }
}

module.exports = new UserController();