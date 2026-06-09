const ExportService = require('../services/ExportService');


// =========================
// EXPORT FACTURES
// =========================

const exportFactures = async (req, res) => {

  try {

    const csv =
      await ExportService.exportFactures();

    res.header(
      'Content-Type',
      'text/csv; charset=utf-8'
    );

    res.attachment('factures.csv');

    res.send('\uFEFF' + csv);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Erreur export factures'
    });
  }
};


// =========================
// EXPORT RELANCES
// =========================

const exportRelances = async (req, res) => {

  try {

    const csv =
      await ExportService.exportRelances();

    res.header(
      'Content-Type',
      'text/csv; charset=utf-8'
    );

    res.attachment('relances.csv');

    res.send('\uFEFF' + csv);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Erreur export relances'
    });
  }
};

// =========================
// EXPORT DEPENSES
// =========================

const exportDepenses = async (req, res) => {

  try {

    const csv =
      await ExportService.exportDepenses();

    res.header(
      'Content-Type',
      'text/csv; charset=utf-8'
    );

    res.attachment('depenses.csv');

    res.send('\uFEFF' + csv);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Erreur export depenses'
    });
  }
};

// =========================
// EXPORT CUMUL DES DEPENSES PAR TYPE
// =========================

const exportDepensesParType = async (req, res) => {

  try {

    const csv =
      await ExportService.exportDepensesParType();

    res.header(
      'Content-Type',
      'text/csv; charset=utf-8'
    );

    res.attachment('depenses-par-type.csv');

    res.send('\uFEFF' + csv);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Erreur export depenses par type'
    });
  }
};


module.exports = {
  exportFactures,
  exportRelances,
  exportDepenses,
  exportDepensesParType
};
