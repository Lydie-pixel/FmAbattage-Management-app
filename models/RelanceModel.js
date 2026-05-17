const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Relance = sequelize.define("Relance", {

  facture_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  niveau: {
    type: DataTypes.ENUM(
      "relance_1",
      "relance_2",
      "relance_3",
      "mise_en_demeure"
    ),
    allowNull: false
  },

  date_relance: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  penalites: {
    type: DataTypes.DECIMAL(10,2),
    defaultValue: 0
  },


  delai_avant_poursuite: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  numero_ar: {
    type: DataTypes.STRING,
    allowNull: true
  },

  statut: {
    type: DataTypes.ENUM(
      "envoyee",
      "payee",
      "procedure",
      "annulee"
    ),
    defaultValue: "envoyee"
  },

  commentaire: {
    type: DataTypes.TEXT,
    allowNull: true
  }

}, {

  tableName: "relances",
  timestamps: false

});

module.exports = Relance;
