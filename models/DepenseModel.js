const { DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const Depense = sequelize.define("Depense", {

  date: {
    type: DataTypes.DATE,
    allowNull: false
  },

    montant: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },

  type: {
    type: DataTypes.ENUM("frais_carburant", "frais_materiel", "charges", "autre"),
    allowNull: false
  },

    description: {
    type: DataTypes.STRING(255),
    allowNull: true
  }

});

module.exports = Depense;