const Client = require('./ClientModel');
const Devis = require('./DevisModel');
const DevisItem = require('./DevisItemModel');
const Facture = require('./FactureModel');
const Paiement = require('./PaiementModel');
const Depense = require('./DepenseModel');
const Relance = require("./RelanceModel");

// Client → Devis
Client.hasMany(Devis, {
  foreignKey: 'client_id',
  as: 'devis'
});

Devis.belongsTo(Client, {
  foreignKey: 'client_id',
  as: 'client'
});

// Devis → Items
Devis.hasMany(DevisItem, {
  foreignKey: 'devis_id',
  as: 'items'
});

DevisItem.belongsTo(Devis, {
  foreignKey: 'devis_id',
  as: 'devis'
});

// Devis → Facture
Devis.hasMany(Facture, {
  foreignKey: "devis_id",
  as: "factures"
});

Facture.belongsTo(Devis, {
  foreignKey: "devis_id",
  as: "devis"
});

// Client → Facture
Client.hasMany(Facture, {
  foreignKey: 'client_id',
  as: 'factures'
});

Facture.belongsTo(Client, {
  foreignKey: 'client_id',
  as: 'client'
});

// Facture → Paiement
Facture.hasMany(Paiement, {
  foreignKey: "facture_id",
  as: "paiements"
});

Paiement.belongsTo(Facture, {
  foreignKey: "facture_id",
  as: "facture"
});

// Facture → Relance
Facture.hasMany(Relance, {
  foreignKey: "facture_id",
  as: "relances"
});

Relance.belongsTo(Facture, {
  foreignKey: "facture_id",
  as: "facture"
});

module.exports = {
  Client,
  Devis,
  DevisItem,
  Facture,
  Paiement,
  Depense,
  Relance
};