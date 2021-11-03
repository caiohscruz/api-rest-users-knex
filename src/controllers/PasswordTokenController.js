const PasswordToken = require("../models/PasswordToken");
const Mailer = require("../nodemailer");
const validator = require('validator');

class PasswordTokenController {
  async recoverPassword(req, res) {
    var email = req.body.email;
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
    var result = await PasswordToken.create(email);
    if (result.status == true) {
      Mailer(email, result.token);
      res.status(200);
      res.send(`Um email será enviado para ${email}`);
    } else {
      res.status(406);
      res.send(result.err)
    }
  }
}

module.exports = new PasswordTokenController();