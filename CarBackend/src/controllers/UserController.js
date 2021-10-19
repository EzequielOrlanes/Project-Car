const { User } = require("../models");

module.exports = {
  async create(req, res) {
    console.log(User);
    const { name, email, password, cpf, role, birthdate } = req.body;

    try {
      await User.create({ name, email, password, cpf, role, birthdate });
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
    const { name, email } = req.body;

    try {
      const user = await User.update({ name, email }, { where: { id } });

      if (!user) return req.status(404);

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
