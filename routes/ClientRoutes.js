const express = require("express");
const router = express.Router();
const ClientController = require("../controllers/ClientController");

// créer un client
router.post("/", ClientController.createClient);

// récupérer un client
router.get("/:id", ClientController.getClientById);

// suprimer un client
router.delete("/:id", ClientController.deleteClient);

// modifier un client
router.put("/:id", ClientController.updateClient);

// liste des clients
router.get("/", ClientController.getAllClients);

module.exports = router;