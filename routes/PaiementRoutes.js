const express = require("express");
const router = express.Router();
const PaiementController = require("../controllers/PaiementController");

// créer un paiement
router.post("/", PaiementController.createPaiement);

// liste des paiements
router.get("/", PaiementController.getAllPaiements);

// récupérer un paiement
router.get("/:id", PaiementController.getPaiementById);

// mettre à jour un paiement
router.put("/:id", PaiementController.updatePaiement);

// supprimer un paiement
router.delete("/:id", PaiementController.deletePaiement);

module.exports = router;