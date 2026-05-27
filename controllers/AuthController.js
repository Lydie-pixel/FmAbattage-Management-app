const bcrypt = require("bcrypt");
const User = require("../models/UserModel");

exports.login = async (req, res) => {

    const { mail, password } = req.body;

    try {

        const user = await User.findOne({
            where: { mail }
        });

        if (!user) {
            return res.status(401).json({
                error: "Identifiants invalides"
            });
        }

        const validPassword =
            await bcrypt.compare(
                password,
                user.password_hash
            );

        if (!validPassword) {
            return res.status(401).json({
                error: "Identifiants invalides"
            });
        }

        req.session.userId = user.id;
        req.session.role = user.role;
        console.log("Session créée :", req.session);

        res.json({
            message: "Connexion réussie"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
};

exports.logout = (req, res) => {

    req.session.destroy(() => {

        res.json({
            message: "Déconnexion réussie"
        });

    });

};

exports.me = (req, res) => {

    if (!req.session.userId) {
        return res.status(401).json({
            error: "Non connecté"
        });
    }

    res.json({
        id: req.session.userId,
        role: req.session.role
    });
};