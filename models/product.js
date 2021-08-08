'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate({ Order }) {
      this.belongsToMany(Order, {
        as: 'orders',
        through: 'ordersproducts',
        foreignKey: 'productId'
      })
    }
  };
  Product.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products'
  });
  return Product;
};