const express = require("express");
const router = express.Router();

const ClientController = require("../controllers/ClientController");
const isAuthenticated = require("../middlewares/authMiddleware");

router.use(isAuthenticated);

/**
 * @swagger
 * /api/client:
 *   post:
 *     summary: Ajouter un client
 *     tags: [Clients]
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
 *         description: Client créé
 */
router.post("/", ClientController.createClient);

/**
 * @swagger
 * /api/client/{id}:
 *   get:
 *     summary: Récupérer un client
 *     tags: [Clients]
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
router.get("/:id", ClientController.getClientById);

/**
 * @swagger
 * /api/client/{id}:
 *   delete:
 *     summary: Supprimer un client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Client supprimé
 */
router.delete("/:id", ClientController.deleteClient);

/**
 * @swagger
 * /api/client/{id}:
 *   put:
 *     summary: Modifier un client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Client modifié
 */
router.put("/:id", ClientController.updateClient);

/**
 * @swagger
 * /api/client:
 *   get:
 *     summary: Récupère tous les clients
 *     tags:
 *       - Clients
 *     responses:
 *       200:
 *         description: Liste des clients
 */
router.get("/", ClientController.getAllClients);

module.exports = router;