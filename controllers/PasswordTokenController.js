const PasswordToken = require("../models/PasswordToken");

class PasswordTokenController {
  async recoverPassword(req, res) {
    var email = req.body.email;
    var result = await PasswordToken.create(email);
    if (result.status == true) {
      res.status(200);
      res.send(result.token);
    } else {
      res.status(406);
      res.send(result.err)
    }
  }
}

module.exports = new PasswordTokenController();

