const express = require("express");
const app = express();

const cors = require("cors");
app.use(express.json());

const session = require("express-session");

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));


app.use(cors());

const path = require("path");

// Login
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Front
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

const depenseRoutes = require("./routes/DepenseRoutes")
app.use("/api/depense", depenseRoutes);

const statsRoutes = require("./routes/StatsRoutes");
app.use("/api/stats", statsRoutes);

const relanceRoutes = require("./routes/RelanceRoutes");
app.use("/api/relance", relanceRoutes);

module.exports = app;