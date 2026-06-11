const express = require("express");
const router = express.Router();

const PdfController = require("../controllers/PdfController");
const PdfFactureController = require("../controllers/PdfFactureController");
const RelancePdfController = require("../controllers/RelancePdfController");
const PdfClientController = require("../controllers/PdfClientController");

const isAuthenticated = require("../middlewares/authMiddleware");

router.use(isAuthenticated);

/**
 * @swagger
 * /api/pdf/devis/{id}:
 *   get:
 *     summary: Génère dynamiquement le PDF d’un devis à partir de son identifiant
 *     tags: [Pdf]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Devis trouvé
 *       404:
 *         description: Devis introuvable
 */
router.get("/devis/:id", PdfController.generateDevisPDF);

/**
 * @swagger
 * /api/pdf/facture/{id}:
 *   get:
 *     summary: Génère dynamiquement le PDF d’une facture à partir de son identifiant
 *     tags: [Pdf]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Facture trouvé
 *       404:
 *         description: Facture introuvable
 */
router.get("/facture/:id", PdfFactureController.generateFacturePDF);

/**
 * @swagger
 * /api/pdf/relance/{id}:
 *   get:
 *     summary: Génère dynamiquement le PDF d’une relance à partir de son identifiant
 *     tags: [Pdf]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relance trouvé
 *       404:
 *         description: Relance introuvable
 */
router.get("/relance/:id", RelancePdfController.generateRelancePDF);

/**
 * @swagger
 * /api/pdf/client/{id}:
 *   get:
 *     summary: Génère dynamiquement le PDF d’un client à partir de son identifiant
 *     tags: [Pdf]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Client trouvé
 *       404:
 *         description: Client introuvable
 */
router.get("/client/:id", PdfClientController.generateClientPDF);

module.exports = router;
