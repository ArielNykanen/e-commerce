const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Sale = sequelize.define('sale', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  productId: {
    type: Sequelize.INTEGER
  },
  productName: {
    type: Sequelize.STRING
  },
  amountOfSales: {
    type: Sequelize.INTEGER
  }
});

module.exports = Sale;