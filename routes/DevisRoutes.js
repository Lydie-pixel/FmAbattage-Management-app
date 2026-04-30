const express = require("express");
const router = express.Router();
const devisController = require("../controllers/DevisController");

router.post("/", devisController.createDevis);

// routes spécifiques d'abord
router.get("/archives", devisController.getArchivedDevis);

// liste générale
router.get("/", devisController.getAllDevis);

// détail
router.get("/:id", devisController.getDevisById);

// actions
router.put("/:id", devisController.updateDevis);
router.put("/:id/statut", devisController.updateDevisStatut);
router.put("/:id/archive", devisController.archiveDevis);
router.delete("/:id", devisController.deleteDevis);

module.exports = router;