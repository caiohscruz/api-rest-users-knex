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
    async validate(token) {
        try {
            var result = await knex
                .select()
                .table("passwordtokens")
                .where({
                    token: token
                })
            if (result.length > 0) {
                let tk = result[0];
                if (tk.used == 0) {
                    let minutes = 0;
                    let expires = minutes * 60 * 1000

                    if (tk.created - Date.now() < expires) {
                        return {
                            status: true,
                            token: tk
                        }
                    } else {
                        return {
                            status: false,
                            err: "Token expirado"
                        }
                    }
                } else {
                    return {
                        status: false,
                        err: "Token já utilizado"
                    }
                }
            } else {
                return {
                    status: false,
                    err: "Token inválido"
                }
            }
        } catch (err) {
            return {
                status: false,
                err: err
            }

        }
    }

    async setUsed(tokenId) {
        try{
            await knex
                .update({
                    used: 1
                })
                .table("passwordtokens")
                .where({
                    id: tokenId
                });
        }catch(err){
            console.log(err);
        }
    }
}

module.exports = new PasswordToken();