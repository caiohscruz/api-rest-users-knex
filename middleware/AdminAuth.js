require('dotenv/config');

const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

module.exports = function (req, res, next) {

    const authToken = req.headers['authorization'];

    if (authToken != undefined) {
        const token = authToken.split(" ")[1]

        try {
            var decoded = jwt.verify(token, secret);

            if (decoded.role == 1) {
                console.log(decoded);
                next();
            } else {
                res.status(403);
                res.send("Você não tem privilégios para esta solicitação");
                return;
            }
        } catch (err) {
            res.status(401);
            res.send("Você não está autenticado");
            return;
        }

    } else {
        res.status(401);
        res.send("Você não está autenticado");
        return;
    }

}