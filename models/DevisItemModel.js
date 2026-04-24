const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DevisItem = sequelize.define("DevisItem", {
    devis_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    description: {
        type: DataTypes.STRING(200),
        allowNull: false
    },

    quantite: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },

    prix_unitaire: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    total_ligne: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
});

module.exports = DevisItem;