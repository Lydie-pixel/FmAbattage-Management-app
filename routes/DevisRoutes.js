const express = require("express");
const router = express.Router();
const devisController = require("../controllers/DevisController");
const isAuthenticated = require("../middlewares/authMiddleware");


router.use(isAuthenticated);

/**
 * @swagger
 * /api/devis:
 *   post:
 *     summary: Ajouter un devis
 *     tags: [Devis]
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
 *         description: Devis créé
 */
router.post("/", devisController.createDevis);

/**
 * @swagger
 * /api/devis/archives:
 *   get:
 *     summary: Récupérer les devis archivés
 *     tags: [Devis]
 *     responses:
 *       200:
 *         description: Liste des devis archivés
 */
router.get("/archives", devisController.getArchivedDevis);

/**
 * @swagger
 * /api/devis/accueil:
 *   get:
 *     summary: Récupérer les devis affichés sur l'accueil
 *     tags: [Devis]
 *     responses:
 *       200:
 *         description: Liste des devis pour l'accueil
 */
router.get("/accueil", devisController.getDevisAccueil);

/**
 * @swagger
 * /api/devis:
 *   get:
 *     summary: Récupérer tous les devis
 *     tags: [Devis]
 *     responses:
 *       200:
 *         description: Liste des devis
 */
router.get("/", devisController.getAllDevis);

/**
 * @swagger
 * /api/devis/{id}:
 *   get:
 *     summary: Récupérer un devis
 *     tags: [Devis]
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
router.get("/:id", devisController.getDevisById);

/**
 * @swagger
 * /api/devis/{id}:
 *   put:
 *     summary: Modifier un devis
 *     tags: [Devis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Devis modifié
 */
router.put("/:id", devisController.updateDevis);

/**
 * @swagger
 * /api/devis/{id}/statut:
 *   put:
 *     summary: Modifier le statut d'un devis
 *     tags: [Devis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Statut du devis modifié
 */
router.put("/:id/statut", devisController.updateDevisStatut);

/**
 * @swagger
 * /api/devis/{id}/archive:
 *   put:
 *     summary: Archiver un devis
 *     tags: [Devis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Devis archivé
 */
router.put("/:id/archive", devisController.archiveDevis);

/**
 * @swagger
 * /api/devis/{id}:
 *   delete:
 *     summary: Supprimer un devis
 *     tags: [Devis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Devis supprimé
 */
router.delete("/:id", devisController.deleteDevis);

module.exports = router;