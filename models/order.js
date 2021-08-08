'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate({ User, Product }) {
      this.belongsTo(User, {
        as: 'user',
        foreignKey: 'userId'
      })

      this.belongsToMany(Product, {
        as: 'products',
        through: 'ordersproducts',
        foreignKey: 'orderId'
      })
    }
  };
  Order.init({
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders'
  });
  return Order;
};