const express = require("express");
const router = express.Router();
const RelanceController = require("../controllers/RelanceController");
const isAuthenticated = require("../middlewares/authMiddleware");

router.use(isAuthenticated);

/**
 * @swagger
 * /api/relance:
 *   post:
 *     summary: Créer une relance
 *     tags: [Relance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               facture_id:
 *                 type: integer
 *               niveau:
 *                 type: string
 *               date_relance:
 *                 type: string
 *                 format: date
 *               penalites:
 *                 type: number
 *     responses:
 *       201:
 *         description: Relance créée
 */
router.post("/", RelanceController.createRelance);

/**
 * @swagger
 * /api/relance/{id}:
 *   get:
 *     summary: Récupérer une relance
 *     tags: [Relance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relance trouvée
 *       404:
 *         description: Relance introuvable
 */
router.get("/:id", RelanceController.getRelanceById);

/**
 * @swagger
 * /api/relance:
 *   get:
 *     summary: Récupérer toutes les relances
 *     tags: [Relance]
 *     responses:
 *       200:
 *         description: Liste des relances
 */
router.get("/", RelanceController.getAllRelance);

/**
 * @swagger
 * /api/relance/{id}:
 *   put:
 *     summary: Modifier une relance
 *     tags: [Relance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relance modifiée
 */
router.put("/:id", RelanceController.updateRelance);

/**
 * @swagger
 * /api/relance/{id}:
 *   delete:
 *     summary: Supprimer une relance
 *     tags: [Relance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relance supprimée
 */
router.delete("/:id", RelanceController.deleteRelance);

module.exports = router;