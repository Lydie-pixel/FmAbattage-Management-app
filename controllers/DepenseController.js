const sequelize = require("../config/database");
const { Depense } = require("../models");
const { Op, fn, col } = require("sequelize");

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

exports.getDepensesStats = async (req, res) => {
  const { year, month } = req.query;

  let where = {};

  // 📅 filtre date
  if (year) {
    const start = month
      ? new Date(year, month - 1, 1)
      : new Date(year, 0, 1);

    const end = month
      ? new Date(year, month, 0)
      : new Date(year, 11, 31);

    where.date = {
      [Op.between]: [start, end]
    };
  }

  try {

    // 🔹 total global
    const totalResult = await Depense.findAll({
      attributes: [
        [fn("SUM", col("montant")), "total"]
      ],
      where,
      raw: true
    });

    const total = parseFloat(totalResult[0].total) || 0;

    // 🔹 total par type
    const parType = await Depense.findAll({
      attributes: [
        "type",
        [fn("SUM", col("montant")), "total"]
      ],
      where,
      group: ["type"],
      raw: true
    });

    res.json({
      total,
      parType
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Trie par poste de dépense:
exports.getDepensesByType = async (req, res) => {
  const { year, month } = req.query;

  let where = {};

  if (year) {
    if (month) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);

      where.date = {
        [Op.between]: [start, end]
      };
    } else {
      where.date = {
        [Op.between]: [
          `${year}-01-01`,
          `${year}-12-31`
        ]
      };
    }
  }

  try {
    const result = await Depense.findAll({
      attributes: [
        "type",
        [fn("SUM", col("montant")), "total"]
      ],
      where,
      group: ["type"]
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};