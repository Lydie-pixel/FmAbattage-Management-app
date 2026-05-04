const express = require("express");
const router = express.Router();
const depenseController = require("../controllers/DepenseController");

router.post("/", depenseController.createDepense);;

// liste générale
router.get("/", depenseController.getAllDepenses);

// détail
router.get("/:id", depenseController.getDepenseById);

// actions
router.delete("/:id", depenseController.deleteDepense);

module.exports = router;