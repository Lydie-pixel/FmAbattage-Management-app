const express = require("express");
const router = express.Router();
const RelanceController = require("../controllers/RelanceController")
const isAuthenticated = require("../middlewares/authMiddleware");

router.use(isAuthenticated);

// créer une relance
router.post("/", RelanceController.createRelance);

// récupérer une relance
router.get("/:id", RelanceController.getRelanceById);

// liste des relances
router.get("/", RelanceController.getAllRelance);

// modifier une relance 
router.put("/:id", RelanceController.updateRelance);

// supprimer une relance
router.delete("/:id", RelanceController.deleteRelance)

module.exports = router;