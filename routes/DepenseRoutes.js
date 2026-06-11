const express = require("express");
const router = express.Router();
const depenseController = require("../controllers/DepenseController");
const isAuthenticated = require("../middlewares/authMiddleware");

router.use(isAuthenticated);

/**
 * @swagger
 * /api/depense:
 *   post:
 *     summary: Ajouter une dépense
 *     tags: [Dépense]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Dépense créé
 */
router.post("/", depenseController.createDepense);;

/**
 * @swagger
 * /api/depense:
 *   get:
 *     summary: Récupérer toutes les dépenses
 *     tags: [Dépense]
 *     responses:
 *       200:
 *         description: Liste des dépenses
 */
router.get("/", depenseController.getAllDepenses);

/**
 * @swagger
 * /api/depense/stats:
 *   get:
 *     summary: Récupérer les statistiques des dépenses
 *     tags: [Dépense]
 *     responses:
 *       200:
 *         description: Statistiques récupérées
 */
router.get("/stats", depenseController.getDepensesStats);

/**
 * @swagger
 * /api/depense/by-type:
 *   get:
 *     summary: Récupérer les dépenses par type
 *     tags: [Dépense]
 *     responses:
 *       200:
 *         description: Dépenses regroupées par type
 */
router.get("/by-type", depenseController.getDepensesByType);

/**
 * @swagger
 * /api/depense/{id}:
 *   get:
 *     summary: Récupérer une dépense
 *     tags: [Dépense]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dépense trouvée
 *       404:
 *         description: Dépense introuvable
 */
router.get("/:id", depenseController.getDepenseById);

/**
 * @swagger
 * /api/depense/{id}:
 *   delete:
 *     summary: Supprimer une dépense
 *     tags: [Dépense]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dépense supprimée
 */
router.delete("/:id", depenseController.deleteDepense);

module.exports = router;