const User = require("./User");
const knex = require("../database/connection");
const {
    v4: uuidv4
} = require('uuid');


class PasswordToken {
    async create(email) {
        var user = await User.findByEmail(email);
        if (user != undefined) {
            try {
                var token = uuidv4();
                await knex
                    .insert({
                        user_id: user.id,
                        used: 0,
                        created: Date.now(),
                        token: token
                    })
                    .table("passwordtokens");
                return {
                    status: true,
                    token: token
                }
            } catch (err) {
                return {
                    status: false,
                    err: err
                }
            }
        } else {
            return {
                status: false,
                err: "O e-mail informado não consta no banco de dados"
            }
        }
    }
    
}

module.exports = new PasswordToken();