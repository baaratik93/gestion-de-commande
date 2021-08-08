'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Order, Role }) {

      this.hasMany(Order, {
        as: 'orders',
        foreignKey: 'userId'
      })

      this.belongsTo(Role, {
        as: 'roled',
        foreignKey: 'roleId'
      })

    }

    toJSON() {
      return {
        ...this.get(), password: null, roleId: undefined
      }
    }

  };
  User.init({
    nom: DataTypes.STRING,
    username: DataTypes.STRING,
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id'
      }
    },
    password: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  });
  return User;
};