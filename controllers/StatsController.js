const { Facture, Depense } = require("../models");
const { Op } = require("sequelize");

exports.getMonthlyStats = async (req, res) => {
  const year = parseInt(req.params.year);
  const month = parseInt(req.params.month);

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  try {
    const factures = await Facture.findAll({
      where: {
        date_facture: {
          [Op.between]: [start, end]
        }
      }
    });

    const depenses = await Depense.findAll({
      where: {
        date: {
          [Op.between]: [start, end]
        }
      }
    });

    let ca = 0;
    let paye = 0;
    let enAttente = 0;

    factures.forEach(f => {
      ca += parseFloat(f.montant);

      if (f.statut === "payee") paye += parseFloat(f.montant);
      if (["en_attente", "partielle"].includes(f.statut)) {
        enAttente += parseFloat(f.montant);
      }
    });

    let totalDepenses = 0;
    depenses.forEach(d => {
      totalDepenses += parseFloat(d.montant);
    });

    res.json({
      ca,
      paye,
      enAttente,
      depenses: totalDepenses,
      benefice: ca - totalDepenses,
      nb_factures: factures.length
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getYearlyStats = async (req, res) => {
  const year = parseInt(req.params.year);

  try {
    const result = [];

    for (let month = 1; month <= 12; month++) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);

      const factures = await Facture.findAll({
        where: {
          date_facture: {
            [Op.between]: [start, end]
          }
        }
      });

      const depenses = await Depense.findAll({
        where: {
          date: {
            [Op.between]: [start, end]
          }
        }
      });

      let ca = 0;
      let paye = 0;

      factures.forEach(f => {
        ca += parseFloat(f.montant);
        if (f.statut === "payee") paye += parseFloat(f.montant);
      });

      let totalDepenses = 0;
      depenses.forEach(d => {
        totalDepenses += parseFloat(d.montant);
      });

      result.push({
        month,
        ca,
        paye,
        depenses: totalDepenses,
        benefice: ca - totalDepenses,
        nb_factures: factures.length
    });
    }

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};