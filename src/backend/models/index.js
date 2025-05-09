const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

const Cliente = require('./cliente')(sequelize);
const User = require('./user')(sequelize);
const DataEntry = require('./dataEntry')(sequelize);

module.exports = {
  sequelize,
  Cliente,
  User,
  DataEntry,
};