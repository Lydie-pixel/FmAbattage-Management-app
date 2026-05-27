const express = require("express");
const router = express.Router();
const statsController = require("../controllers/StatsController");
const isAuthenticated = require("../middlewares/authMiddleware");

router.use(isAuthenticated);

router.get("/month/:year/:month", statsController.getMonthlyStats);
router.get("/year/:year", statsController.getYearlyStats);

module.exports = router;