const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const UserDetail = sequelize.define('userDetail', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  userName: {
    type: Sequelize.STRING
  },
  totalOfOrders: {
    type: Sequelize.DOUBLE
  },
  orders: {
    type: Sequelize.INTEGER
  }
});

module.exports = UserDetail;