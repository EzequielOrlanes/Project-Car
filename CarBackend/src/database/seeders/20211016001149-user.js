"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Users", [
      {
        name: "Ezequiel",
        email: "ezequielmoreira@cpejr.com.br",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete("Users", {
      email: {
        [Op.in]: ["ezequielmoreira@cpejr.com.br"],
      },
    });
  },
};
