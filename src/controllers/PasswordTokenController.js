const PasswordToken = require("../models/PasswordToken");
const Mailer = require("../nodemailer");

class PasswordTokenController {
  async recoverPassword(req, res) {
    var email = req.body.email;
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