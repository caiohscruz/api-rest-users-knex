class HomeController {
  async index(req, res) {
      res.status(200);
      res.send(`HomePage`);
  }
}

module.exports = new HomeController();