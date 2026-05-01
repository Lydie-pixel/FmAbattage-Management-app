const express = require("express");
const router = express.Router();
const depenseController = require("../controllers/DepenseController");

router.post("/", depenseController.createDepense);

// routes spécifiques d'abord
router.get("/archives", depenseController.getArchivedDepenses);

// liste générale
router.get("/", depenseController.getAllDepenses);

// détail
router.get("/:id", depenseController.getDepenseById);

// actions
router.put("/:id", depenseController.updateDepense);
router.put("/:id/statut", depenseController.updateDepenseStatut);
router.put("/:id/archive", depenseController.archiveDepense);
router.delete("/:id", depenseController.deleteDepense);

module.exports = router;