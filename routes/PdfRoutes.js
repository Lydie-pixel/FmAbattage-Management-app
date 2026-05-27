const express = require("express");
const router = express.Router();
const PdfController = require("../controllers/PdfController");
const PdfFactureController = require("../controllers/PdfFactureController");
const RelancePdfController = require("../controllers/RelancePdfController")
const isAuthenticated = require("../middlewares/authMiddleware");

router.use(isAuthenticated);

router.get("/devis/:id", PdfController.generateDevisPDF);
router.get("/facture/:id", PdfFactureController.generateFacturePDF);
router.get("/relance/:id", RelancePdfController.generateRelancePDF);

module.exports = router;