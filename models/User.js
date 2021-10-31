const knex = require("../database/connection");
const bcrypt = require("bcrypt");

async function getHash(password) {
  var hash = await bcrypt.hash(password, 10);
  return hash;
}
class User {
  async findAll() {
    try {
      var result = await knex
        .select(["id", "name", "email", "role"])
        .table("users");
      return result;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  async findById(id) {
    try {
      var result = await knex
        .select(["id", "name", "email", "role"])
        .table("users")
        .where({
          id: id
        });
      if (result.length > 0) {
        return result[0];
      } else {
        return undefined;
      }
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  async findByEmail(email) {
    try {
      var result = await knex
        .select(["id", "name", "password", "email", "role"])
        .table("users")
        .where({
          email: email
        });
      if (result.length > 0) {
        return result[0];
      } else {
        return undefined;
      }
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  async new(name, email, password) {
    try {
      var hash = await getHash(password);

      await knex
        .insert({
          name,
          email,
          password: hash,
          role: 0
        })
        .table("users");
      return {
        status: true
      }
    } catch (err) {
      return {
        status: false,
        err: err
      }
    }
  }

  async update(id, name, email, role) {
    var editUser = {};

    if (email != undefined) {
      editUser.email = email;
    }
    if (name != undefined) {
      editUser.name = name;
    }
    if (role != undefined) {
      editUser.role = role;
    }

    try {
      await knex.update(editUser).where({
        id: id
      }).table("users");
      return {
        status: true
      };
    } catch (err) {
      return {
        status: false,
        err: err
      };
    }
  }

  async delete(id) {
    try {
      await knex.delete().where({
        id: id
      }).table("users");
      return {
        status: true
      };
    } catch (err) {
      return {
        status: false,
        err: err
      }
    }
  }

  async updatePassword(id, password) {
    if (password == undefined) {
      return {
        status: false,
        err: "Password indefinido"
      }
    }
    try {
      var hash = await getHash(password);

      await knex
        .update({
          password: hash
        })
        .where({
          id: id
        })
        .table("users");
      return {
        status: true
      };
    } catch (err) {
      return {
        status: false,
        err: err
      };
    }
  }
}


module.exports = new User();