const { Facture, Depense, Paiement } = require("../models");
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

    const paiements = await Paiement.findAll({
      where: {
        date_paiement: {
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

    // Total facturé
    let ca = 0;

    factures.forEach(f => {
      ca += parseFloat(f.montant);
    });

    // Total réellement payé
    let paye = 0;

    paiements.forEach(p => {
      paye += parseFloat(p.montant);
    });

    // Reste à encaisser
    const enAttente = ca - paye;

    // Dépenses
    let totalDepenses = 0;

    depenses.forEach(d => {
      totalDepenses += parseFloat(d.montant);
    });

    res.json({
      ca,
      paye,
      enAttente,
      depenses: totalDepenses,
      benefice: paye - totalDepenses,
      nb_factures: factures.length
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
};

exports.getYearlyStats = async (req, res) => {

  const year = parseInt(req.params.year);

  try {

    const result = [];

    for (let month = 1; month <= 12; month++) {

      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);

      // FACTURES
      const factures = await Facture.findAll({
        where: {
          date_facture: {
            [Op.between]: [start, end]
          }
        }
      });

      // PAIEMENTS
      const paiements = await Paiement.findAll({
        where: {
          date_paiement: {
            [Op.between]: [start, end]
          }
        }
      });

      // DEPENSES
      const depenses = await Depense.findAll({
        where: {
          date: {
            [Op.between]: [start, end]
          }
        }
      });

      // Total facturé
      let ca = 0;

      factures.forEach(f => {
        ca += parseFloat(f.montant);
      });

      // Total réellement payé
      let paye = 0;

      paiements.forEach(p => {
        paye += parseFloat(p.montant);
      });

      // Reste à encaisser
      const enAttente = ca - paye;

      // Dépenses
      let totalDepenses = 0;

      depenses.forEach(d => {
        totalDepenses += parseFloat(d.montant);
      });

      result.push({
        month,
        ca,
        paye,
        enAttente,
        depenses: totalDepenses,
        benefice: paye - totalDepenses,
        nb_factures: factures.length
      });
    }

    res.json(result);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
};