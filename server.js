const mysql = require('mysql2');

const express = require("express");
const path = require("path");
require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/database");

const PORT = 3000;

// 🔥 fichiers statiques (IMPORTANT pour ton front)
app.use(express.static(path.join(__dirname, "front")));

// page d'accueil
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "front", "index.html"));
});

// connexion + lancement serveur
sequelize.sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur le port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erreur connexion BDD :", error);
  });