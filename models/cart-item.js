const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const CartItem = sequelize.define('cartItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: Sequelize.INTEGER
}, {
    classMethods: {
      associate: function (models) {
        CartItem.belongsTo(models.product, { foreignKey: productId })
      }
    }
});

module.exports = CartItem;