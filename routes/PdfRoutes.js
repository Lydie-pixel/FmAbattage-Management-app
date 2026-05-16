const express = require("express");
const router = express.Router();
const PdfController = require("../controllers/PdfController");
const PdfFactureController = require("../controllers/PdfFactureController");
const RelancePdfController = require("../controllers/RelancePdfController")

router.get("/devis/:id", PdfController.generateDevisPDF);
router.get("/facture/:id", PdfFactureController.generateFacturePDF);
router.get("/relance/:id", RelancePdfController.generatePDF);

module.exports = router;