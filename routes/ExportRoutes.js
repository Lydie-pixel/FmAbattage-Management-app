const express = require("express");
const router = express.Router();
const ExportController = require('../controllers/ExportController');

// =========================
// EXPORT FACTURES
// =========================
/**
 * @swagger
 * /api/export/factures:
 *   get:
 *     summary: Exporter les factures
 *     tags: [Export]
 *     responses:
 *       200:
 *         description: Export des factures
 */
router.get("/factures", ExportController.exportFactures);

// =========================
// EXPORT DÉPENSES
// =========================
/**
 * @swagger
 * /api/export/depenses:
 *   get:
 *     summary: Exporter les dépenses
 *     tags: [Export]
 *     responses:
 *       200:
 *         description: Export des dépenses
 */
router.get("/depenses", ExportController.exportDepenses);

// =========================
// EXPORT RELANCES
// =========================
/**
 * @swagger
 * /api/export/relances:
 *   get:
 *     summary: Exporter les relances
 *     tags: [Export]
 *     responses:
 *       200:
 *         description: Export des relances
 */
router.get("/relances", ExportController.exportRelances);

// =========================
// EXPORT DÉPENSES PAR TYPE
// =========================
/**
 * @swagger
 * /api/export/depenses-par-type:
 *   get:
 *     summary: Exporter les dépenses par type
 *     tags: [Export]
 *     responses:
 *       200:
 *         description: Export des dépenses par type
 */
router.get("/depenses-par-type", ExportController.exportDepensesParType);

module.exports = router;