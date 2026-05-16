const { Devis, DevisItem, Client, Facture } = require("../models");
const sequelize = require("../config/database");
const { Op } = require("sequelize");

const PdfController = require("./PdfController");

exports.createDevis = async (req, res) => {

  const { client_id, date_devis, date_echeance, frais_deplacement = 0, items } = req.body;

  // VALIDATION
  if (!client_id || !date_devis || !date_echeance) {
    return res.status(400).json({ error: "Champs obligatoires manquants" });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Items manquants ou invalides" });
  }

  const transaction = await sequelize.transaction();

  let devis;

  try {
    // calcul total
    let total = 0;
    items.forEach(item => {
      total += item.quantite * item.prix_unitaire;
    });
    total += parseFloat(frais_deplacement);

    // génération numéro
    const year = new Date().getFullYear();

    const lastDevis = await Devis.findOne({
      order: [['id', 'DESC']],
      transaction
    });

    let nextNumber = 1;

    if (lastDevis && lastDevis.numero) {
      const lastNum = parseInt(lastDevis.numero.split('-')[2]);
      nextNumber = lastNum + 1;
    }

    const numero = `D-${year}-${String(nextNumber).padStart(3, '0')}`;

    // création devis
    devis = await Devis.create({
      numero,
      client_id,
      date_devis,
      date_echeance,
      frais_deplacement,
      montant: total
    }, { transaction });

    // création items
    for (const item of items) {
      await DevisItem.create({
        devis_id: devis.id,
        description: item.description,
        quantite: item.quantite,
        prix_unitaire: item.prix_unitaire,
        total_ligne: item.quantite * item.prix_unitaire
      }, { transaction });
    }

    await transaction.commit();

  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ error: error.message });
  }

  //  PDF en dehors de la transaction
  try {
    await PdfController.generateDevisPDFInternal(devis.id);
  } catch (err) {
    console.error("Erreur PDF :", err);
  }

  // réponse propre JSON
  res.status(201).json({
    message: "Devis créé",
    id: devis.id,
    numero: devis.numero
  });
};

exports.getDevisById = async (req, res) => {
  try {
    const devis = await Devis.findByPk(req.params.id, {
      include: [
        { model: Client, as: "client" },
        { model: DevisItem, as: "items" }
      ]
    });

    res.json(devis);
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllDevis = async (req, res) => {
  try {
    const devis = await Devis.findAll({
    include: [
    {
      model: Client,
      as: "client"
    },
    {
      model: DevisItem,
      as: "items"
    },
    {
    model: Facture,
    as: "factures"
    }
  ],
  where: {
    statut: {
      [Op.in]: ["en_attente", "accepte", "refuse"]
    }
  },
  order: [["date_devis", "DESC"]],
        });

    res.json(devis);
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDevisAccueil = async (req, res) => {
    const devis = await Devis.findAll({
      include: [
      {
        model: Client,
        as: "client"
      },
      {
        model: DevisItem,
        as: "items"
      }
    ],
    where: {
      statut: "en_attente",
      date_echeance: {
        [Op.gte]: new Date()
      }
    },
    order: [["date_echeance", "ASC"]]
  });

  res.json(devis);
};

exports.updateDevisStatut = async (req, res) => {
  const { statut } = req.body; 
  try {
    const devis = await Devis.findByPk(req.params.id);
    if (!devis) {
      return res.status(404).json({ error: "Devis non trouvé" });
    }
    if (devis.statut === "accepte") {
      return res.status(400).json({ error: "Impossible de mettre à jour un devis accepté" });
    }
    if (!['en_attente', 'accepte', 'refuse', 'archive'].includes(statut)) {
      return res.status(400).json({ error: "Statut invalide" });
    }
    devis.statut = statut;
    await devis.save();
    res.json({ message: "Statut du devis mis à jour", devis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDevis = async (req, res) => {
  try {
    const devis = await Devis.findByPk(req.params.id); 
    if (!devis) {
      return res.status(404).json({ error: "Devis non trouvé" });
    }
    if (devis.statut === "accepte") {
      return res.status(400).json({ error: "Impossible de supprimer un devis accepté" });
    }
    await devis.destroy();
    res.json({ message: "Devis supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.archiveDevis = async (req, res) => {
  try {
    const devis = await Devis.findByPk(req.params.id);
    if (!devis) {
      return res.status(404).json({ error: "Devis non trouvé" });
    } 
    if (devis.statut === "archive") {
      return res.status(400).json({ error: "Impossible de modifier un devis archivé" });
    }
    if (devis.statut === "accepte") {
      return res.status(400).json({ error: "Impossible d'archiver un devis accepté" });
    }
    devis.statut = "archive";
    devis.archivedAt = new Date();
    await devis.save();
    res.json({ message: "Devis archivé avec succès", devis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getArchivedDevis = async (req, res) => {
  try {
    const devis = await Devis.findAll({
      where: {
        statut: 'archive'
      }
    });

    res.json(devis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Modifier un devis
exports.updateDevis = async (req, res) => {
  try {

    const devis = await Devis.findByPk(req.params.id);

    if (!devis) {
      return res.status(404).json({
        error: "Devis non trouvé"
      });
    }

    const {
      client_id,
      date_devis,
      date_echeance,
      frais_deplacement,
      items
    } = req.body;

    // recalcul montant
    let montant = 0;

    items.forEach(item => {
      montant += item.quantite * item.prix_unitaire;
    });

    montant += parseFloat(frais_deplacement || 0);

    // update devis
    await devis.update({
      client_id,
      date_devis,
      date_echeance,
      frais_deplacement,
      montant
    });

    // supprimer anciens items
    await DevisItem.destroy({
      where: {
        devis_id: devis.id
      }
    });

    // recréer items
    for (const item of items) {
      await DevisItem.create({
        devis_id: devis.id,
        description: item.description,
        quantite: item.quantite,
        prix_unitaire: item.prix_unitaire
      });
    }

    res.json({
      message: "Devis modifié avec succès"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};