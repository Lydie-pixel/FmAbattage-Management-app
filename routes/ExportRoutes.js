const express = require("express");
const router = express.Router();
const ExportController = require('../controllers/ExportController');

// =========================
// ROUTES EXPORT
// =========================

router.get("/factures", ExportController.exportFactures);
router.get("/depenses", ExportController.exportDepenses);
router.get("/relances", ExportController.exportRelances);
router.get("/depenses-par-type", ExportController.exportDepensesParType);


module.exports = router;