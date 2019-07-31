"use strict";

const faker = require("faker");

let wikis = [
  {
    title: faker.hacker.noun(),
    body: faker.hacker.phrase(),
    private: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 14
  },
  {
    title: faker.hacker.noun(),
    body: faker.hacker.phrase(),
    private: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 15
  }
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Wikis", wikis, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Wikis", null, {});
  }
};
