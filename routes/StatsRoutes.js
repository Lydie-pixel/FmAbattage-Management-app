const express = require("express");
const router = express.Router();
const statsController = require("../controllers/StatsController");
const isAuthenticated = require("../middlewares/authMiddleware");

router.use(isAuthenticated);

/**
 * @swagger
 * /api/stats/month/{year}/{month}:
 *   get:
 *     summary: Récupérer les statistiques mensuelles
 *     tags: [Stats]
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Statistiques mensuelles récupérées avec succès
 */
router.get("/month/:year/:month", statsController.getMonthlyStats);

/**
 * @swagger
 * /api/stats/year/{year}:
 *   get:
 *     summary: Récupérer les statistiques annuelles
 *     tags: [Stats]
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Statistiques annuelles récupérées avec succès
 */
router.get("/year/:year", statsController.getYearlyStats);

module.exports = router;