const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("fdp", "postgres", "root", {
  host: "localhost",
  dialect: "postgres", // or 'postgres', 'sqlite', etc.
});

module.exports = sequelize;
