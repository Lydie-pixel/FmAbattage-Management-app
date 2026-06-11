const express = require("express");
const router = express.Router();
const factureController = require("../controllers/FactureController");
const isAuthenticated = require("../middlewares/authMiddleware");

router.use(isAuthenticated);

/**
 * @swagger
 * /api/facture:
 *   get:
 *     summary: Récupérer toutes les factures
 *     tags: [Facture]
 *     responses:
 *       200:
 *         description: Liste des factures
 */
router.get("/", factureController.getAllFactures);

/**
 * @swagger
 * /api/facture/archives:
 *   get:
 *     summary: Récupérer les factures archivées
 *     tags: [Facture]
 *     responses:
 *       200:
 *         description: Liste des factures archivées
 */
router.get("/archives", factureController.getArchivedFactures);

/**
 * @swagger
 * /api/facture/{id}:
 *   get:
 *     summary: Récupérer une facture
 *     tags: [Facture]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Facture trouvée
 *       404:
 *         description: Facture introuvable
 */
router.get("/:id", factureController.getFactureById);

/**
 * @swagger
 * /api/facture/{id}/statut:
 *   put:
 *     summary: Modifier le statut d'une facture
 *     tags: [Facture]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Facture modifiée
 */
router.put("/:id/statut", factureController.updateFactureStatus);

/**
 * @swagger
 * /api/facture/{id}:
 *   delete:
 *     summary: Supprimer une facture
 *     tags: [Facture]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Facture supprimée
 *       404:
 *         description: Facture introuvable
 */
router.delete("/:id", factureController.deleteFacture);

/**
 * @swagger
 * /api/facture/from-devis/{id}:
 *   post:
 *     summary: Créer une facture à partir d'un devis
 *     tags: [Facture]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Facture créée
 */
router.post("/from-devis/:id", factureController.createFactureFromDevis);

/**
 * @swagger
 * /api/facture/{id}/archive:
 *   put:
 *     summary: Archiver une facture
 *     tags: [Facture]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Facture archivée
 */
router.put("/:id/archive", factureController.archiveFacture);

module.exports = router;