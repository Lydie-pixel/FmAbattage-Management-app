const express = require("express");
const router = express.Router();
const factureController = require("../controllers/FactureController");

router.get("/", factureController.getAllFactures);

router.get("/archives", factureController.getArchivedFactures);

router.get("/:id", factureController.getFactureById);
router.put("/:id/statut", factureController.updateFactureStatus);
router.delete("/:id", factureController.deleteFacture);
router.post("/from-devis/:id", factureController.createFactureFromDevis);
router.put("/:id/archive", factureController.archiveFacture);


module.exports = router;