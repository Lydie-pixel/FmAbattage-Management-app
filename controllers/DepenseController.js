const sequelize = require("../config/database");
const { Depense } = require("../models");

exports.getAllDepenses = async (req, res) => {
  try {
    const { year, month } = req.query;

    let where = {};

    if (year && month) {
      where.date = {
        [Op.between]: [
          `${year}-${month}-01 00:00:00`,
          `${year}-${month}-31 23:59:59`
        ]
      };
    }

    const depenses = await Depense.findAll({ where });

    res.json(depenses);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createDepense = async (req, res) => {
    try {
        const depense = await Depense.create(req.body);
        res.status(201).json(depense);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteDepense = async (req, res) => {
    try {
        const depense = await Depense.findByPk(req.params.id);
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

exports.getDepenseById = async (req, res) => {
  try {
    const depense = await Depense.findByPk(req.params.id);

    if (!depense) {
      return res.status(404).json({ error: "Dépense non trouvée" });
    }

    res.json(depense);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
