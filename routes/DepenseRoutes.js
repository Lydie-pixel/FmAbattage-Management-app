const express = require("express");
const router = express.Router();
const depenseController = require("../controllers/DepenseController");

router.post("/", depenseController.createDepense);;

// liste générale
router.get("/", depenseController.getAllDepenses);
router.get("/stats", depenseController.getDepensesStats);
router.get("/by-type", depenseController.getDepensesByType);

// détail
router.get("/:id", depenseController.getDepenseById);

// actions
router.delete("/:id", depenseController.deleteDepense);

module.exports = router;