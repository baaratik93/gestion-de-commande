'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products_orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Product, Order }) {
      this.belongsTo(Product, {
        as: 'products',
        foreignKey: 'productId'
      })

      this.belongsTo(Order, {
        as: 'orders',
        foreignKey: 'orderId'
      })
    }
  };
  products_orders.init({
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'products_orders',
  });
  return products_orders;
};