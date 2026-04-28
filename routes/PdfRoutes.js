const express = require("express");
const router = express.Router();
const PdfController = require("../controllers/PdfController");

router.get("/devis/:id", PdfController.generateDevisPDF);

module.exports = router;