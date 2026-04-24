const { DataTypes, ENUM } = require("sequelize");
const sequelize = require("../config/database");

const Paiement = sequelize.define("Paiement", {

  facture_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  montant: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  date_paiement: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  mode_paiement: {
  type: DataTypes.ENUM(
    'virement_A',
    'virement_B',
    'cheque',
    'especes',
    'autre'
  ),
  allowNull: false
  }
  
});

module.exports = Paiement;