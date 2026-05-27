const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User",{

    mail:{
        type: DataTypes.STRING(300),
        unique: true 
    },

    username: {
        type: DataTypes.STRING(100),
        unique: true
    },

    role:{
        type: DataTypes.ENUM(
            'user', 
            'admin'
        ),
        defaultValue: 'user'
    },

    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = User;