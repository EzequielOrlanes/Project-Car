const { User } = require("../models");
const argon2 = require("argon2");

module.exports = {
  async create(req, res) {
    console.log(User);
    const { name, email, password } = req.body;

    const hashed_password = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    try {
      const result = await User.create({ name, email, hashed_password });
      delete result.hashed_password;

      return res.status(201).json();
    } catch (error) {
      console.log(error);
      return res.status(500).json();
    }
  },

  async read(req, res) {
    try {
      const users = await User.findAll();

      return res.status(200).json({ users });
    } catch (error) {
      console.log(error);
      return res.status(500).json();
    }
  },

  async update(req, res) {
    const { id } = req.params;
    try {
      let user;
      console.log(user);
      if (req.body.name) user.name = req.body.name;
      if (req.body.email) user.email = req.body.email;
      if (req.body.password) {
        const hashed_password = await argon2.hash(password, {
          type: argon2.argon2id,
        });

        user.password = hashed_password;
      }
      return res.status(204).json();
    } catch (error) {
      return res.status(500).json();
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    try {
      await User.destroy({ where: { id } });
      return res.status(204).json();
    } catch (error) {
      return res.status(500).josn();
    }
  },
};
