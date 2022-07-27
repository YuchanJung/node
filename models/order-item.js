const { DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const OrderItem = sequelize.define("orderItems", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
});

module.exports = OrderItem;
