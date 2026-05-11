const { DataTypes, ENUM } = require("sequelize");
const sequelize = require("../config/database");

const Facture = sequelize.define("Facture", {

  numero: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  devis_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

    client_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

    date_facture: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  frais_deplacement_final: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },

    montant: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  statut: {
    type: ENUM(
    'en_attente',
    'payee',
    'partielle',
    'archive'
  ),
  defaultValue: 'en_attente'
},

  createdAt: {
  type: DataTypes.DATE,
  defaultValue: DataTypes.NOW
},

    archivedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }

});

module.exports = Facture;
