const express = require("express");
const app = express();

const cors = require("cors");
app.use(express.json());
app.use(cors());

const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes

const devisRoutes = require("./routes/DevisRoutes");
app.use("/api/devis", devisRoutes);

const clientRoutes = require("./routes/ClientRoutes");
app.use("/api/client", clientRoutes);

const factureRoutes = require("./routes/FactureRoutes");
app.use("/api/facture", factureRoutes);

const paiementRoutes = require("./routes/PaiementRoutes");
app.use("/api/paiement", paiementRoutes);

const pdfRoutes = require("./routes/PdfRoutes");
app.use("/api/pdf", pdfRoutes);

module.exports = app;