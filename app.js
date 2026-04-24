const express = require("express");
const app = express();

const cors = require("cors");
app.use(express.json());
app.use(cors());

// Routes

const devisRoutes = require("./routes/DevisRoutes");
app.use("/api/devis", devisRoutes);

const clientRoutes = require("./routes/ClientRoutes");
app.use("/api/client", clientRoutes);

const factureRoutes = require("./routes/FactureRoutes");
app.use("/api/facture", factureRoutes);

const paiementRoutes = require("./routes/PaiementRoutes");
app.use("/api/paiement", paiementRoutes);

module.exports = app;