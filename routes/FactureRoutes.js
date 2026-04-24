const express = require("express");
const router = express.Router();
const factureController = require("../controllers/FactureController");

router.get("/", factureController.getAllFactures);
router.get("/:id", factureController.getFactureById);
router.post("/from-devis/:id", factureController.createFactureFromDevis);
router.put("/:id/archive", factureController.archiveFacture);
router.get("/archives", factureController.getArchivedFactures);
router.get("/stats/:year/:month", factureController.getMonthlyStats);

module.exports = router;