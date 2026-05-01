const sequelize = require("../config/database");
const { Depence, Facture, Devis, DevisItem, Client } = require("../models");

exports.getAllDepenses = async (req, res) => {
    try {
        const depenses = await Depence.findAll();
        res.json(depenses);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createDepense = async (req, res) => {
    try {
        const depense = await Depence.create(req.body);
        res.status(201).json(depense);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteDepense = async (req, res) => {
    try {
        const depense = await Depence.findByPk(req.params.id);
        if (!depense) {
            return res.status(404).json({ error: "Dépense non trouvée" });
        }
        await depense.destroy();
        res.json({ message: "Dépense supprimée avec succès" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
