"use strict";

let users = [
  {
    id: 14,
    username: "user1",
    email: "user1@gmail.com",
    password: "password1",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "standard"
  },
  {
    id: 15,
    username: "user2",
    email: "user2@gmail.com",
    password: "password2",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "standard"
  }
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
