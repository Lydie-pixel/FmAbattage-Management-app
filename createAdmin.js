const bcrypt = require("bcrypt");
const sequelize = require("./config/database");
const User = require("./models/UserModel");

async function createAdmin() {

    try {

        await sequelize.authenticate();

        const hash = await bcrypt.hash(
            "TonMotDePasse",
            10
        );

        await User.create({
            mail: "fleursdesiles7@gmail.com",
            username: "Lydie",
            role: "admin",
            password_hash: hash
        });

        console.log("Compte admin créé");

        process.exit();

    } catch (error) {

        console.error(error);
        process.exit(1);

    }
}

createAdmin();