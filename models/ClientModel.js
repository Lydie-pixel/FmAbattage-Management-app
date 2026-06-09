const { DataTypes, ENUM } = require("sequelize");
const sequelize = require("../config/database");

const Client = sequelize.define("Client", {

  nom: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  tel: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: false
  },

  adresse: {
    type: DataTypes.STRING(200),
    allowNull: true
  },

  code_postal: {
    type: DataTypes.STRING(20),
    allowNull: true
  },

  ville: {
    type: DataTypes.STRING(100),
    allowNull: true
  },

  commentaire: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  createdAt: {
  type: DataTypes.DATE,
  defaultValue: DataTypes.NOW
}

});

module.exports = Client;
