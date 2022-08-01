const { DataTypes } = require("sequelize");

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
  sequelize.define("user", {
    // The following specification of the 'id' attribute could be omitted
    // since it is the default.
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    uid: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    role: {
      allowNull: false,
      type: DataTypes.ENUM("ADMIN", "MEMBER", "TRAINER")
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    mobile: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active"
    }
  });
};
