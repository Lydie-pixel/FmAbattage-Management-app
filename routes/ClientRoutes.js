const express = require("express");
const router = express.Router();

const ClientController = require("../controllers/ClientController");
const isAuthenticated = require("../middlewares/authMiddleware");

router.use(isAuthenticated);

router.post("/", ClientController.createClient);
router.get("/:id", ClientController.getClientById);
router.delete("/:id", ClientController.deleteClient);
router.put("/:id", ClientController.updateClient);
router.get("/", ClientController.getAllClients);

module.exports = router;