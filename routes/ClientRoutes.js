const express = require("express");
const router = express.Router();
const ClientController = require("../controllers/ClientController");

// 🔥 créer un client
router.post("/", ClientController.createClient);

// 📄 récupérer un client
router.get("/:id", ClientController.getClientById);

// 📋 liste des clients
router.get("/", ClientController.getAllClients);

module.exports = router;