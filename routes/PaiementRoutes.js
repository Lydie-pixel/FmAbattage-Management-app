const express = require("express");
const router = express.Router();
const PaiementController = require("../controllers/PaiementController");
const isAuthenticated = require("../middlewares/authMiddleware");

router.use(isAuthenticated);

/**
 * @swagger
 * /api/paiement:
 *   post:
 *     summary: Ajouter un paiement
 *     tags: [Paiement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               montant:
 *                 type: number
 *               mode_paiement:
 *                 type: string
 *               facture_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Paiement créé
 */
router.post("/", PaiementController.createPaiement);

/**
 * @swagger
 * /api/paiement:
 *   get:
 *     summary: Récupérer tous les paiements
 *     tags: [Paiement]
 *     responses:
 *       200:
 *         description: Liste des paiements
 */
router.get("/", PaiementController.getAllPaiements);

/**
 * @swagger
 * /api/paiement/{id}:
 *   get:
 *     summary: Récupérer un paiement
 *     tags: [Paiement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paiement trouvé
 *       404:
 *         description: Paiement introuvable
 */
router.get("/:id", PaiementController.getPaiementById);

/**
 * @swagger
 * /api/paiement/{id}:
 *   put:
 *     summary: Modifier un paiement
 *     tags: [Paiement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paiement modifié
 */
router.put("/:id", PaiementController.updatePaiement);

/**
 * @swagger
 * /api/paiement/{id}:
 *   delete:
 *     summary: Supprimer un paiement
 *     tags: [Paiement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paiement supprimé
 */
router.delete("/:id", PaiementController.deletePaiement);

module.exports = router;