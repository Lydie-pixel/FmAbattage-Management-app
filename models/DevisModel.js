const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Devis = sequelize.define("Devis", {

  numero: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },

  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  date_devis: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  date_echeance: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  montant: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  frais_deplacement: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },

  statut: {
    type: DataTypes.ENUM(
      'en_attente',
      'accepte',
      'refuse',
      'archive'
    ),
    defaultValue: 'en_attente'
  },

  createdAt: {
  type: DataTypes.DATE,
  defaultValue: DataTypes.NOW
},

updatedAt: {
  type: DataTypes.DATE,
  defaultValue: DataTypes.NOW
},

archivedAt: {
  type: DataTypes.DATE
}

}, {
  tableName: "devis",
  timestamps: true
});

module.exports = Devis;