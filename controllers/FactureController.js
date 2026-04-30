const { Facture, Devis, DevisItem, Client } = require("../models");
const sequelize = require("../config/database");
const { Op } = require("sequelize");

exports.getAllFactures = async (req, res) => {
  try {
    const factures = await Facture.findAll({
    include: [
      {
        model: Client,
        as: "client"
      },
      {
        model: Devis,
        as: "devis"
      }
    ]
    });

    res.json(factures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFactureById = async (req, res) => {
  try {
    const factures = await Facture.findByPk(req.params.id, {
      include: [
        {
          model: Client,
          as: "client"
        }
      ]
    });
    if (factures) {
      res.json(factures);
    } else {
      res.status(404).json({ error: "Facture non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createFactureFromDevis = async (req, res) => {

  const { frais_deplacement_final = 0 } = req.body;

  try {

    const devis = await Devis.findByPk(req.params.id, {
      include: [{ model: DevisItem, as: "items" }]
    });

    if (!devis) {
      return res.status(404).json({ error: "Devis non trouvé" });
    }

    if (devis.statut !== "accepte") {
      return res.status(400).json({ error: "Le devis doit être accepté" });
    }

    // 🔢 génération numéro facture
    const year = new Date().getFullYear();

    const lastFacture = await Facture.findOne({
      order: [['id', 'DESC']]
    });

    let nextNumber = 1;

    if (lastFacture && lastFacture.numero) {
      const lastNum = parseInt(lastFacture.numero.split('-')[2]);
      nextNumber = lastNum + 1;
    }

    const numero = `F-${year}-${String(nextNumber).padStart(3, '0')}`;

    // 💰 calcul montant
    let total = 0;

    devis.items.forEach(item => {
      total += item.total_ligne;
    });

    total += parseFloat(frais_deplacement_final);

    // 🧾 création facture
    const facture = await Facture.create({
      numero,
      devis_id: devis.id,
      client_id: devis.client_id,
      date_facture: new Date(),
      montant: total,
      frais_deplacement_final
    });

    res.status(201).json({
      message: "Facture créée avec succès 🔥",
      facture
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFacture = async (req, res) => {
  try {
    const facture = await Facture.findByPk(req.params.id);
    if (!facture) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }
    if (facture.statut === "payee") {
      return res.status(400).json({ error: "Impossible de supprimer une facture payée" });
    }
    await facture.destroy();
    res.json({ message: "Facture supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.archiveFacture = async (req, res) => {
  try {
    const facture = await Facture.findByPk(req.params.id);

    if (!facture) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }

    if (facture.statut !== "payee") {
      return res.status(400).json({
        error: "Impossible d'archiver une facture non payée"
      });
    }

    facture.statut = "archive";
    facture.archivedAt = new Date();

    await facture.save();

    res.json({
      message: "Facture archivée avec succès",
      facture
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getArchivedFactures = async (req, res) => { 
    try {
    const factures = await Facture.findAll({
      where: {
        statut: 'archive'
      }
    });
    res.json(factures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }};

exports.updateFactureStatus = async (req, res) => {
  try {
    const facture = await Facture.findByPk(req.params.id);
    if (!facture) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }
    const { statut } = req.body;
    if (!['en_attente', 'payee', 'partielle'].includes(statut)) {
      return res.status(400).json({ error: "Statut invalide" });
    }
    facture.statut = statut;
    await facture.save();
    res.json({ message: "Statut de la facture mis à jour avec succès", facture });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMonthlyStats = async (req, res) => {
  const { year, month } = req.params;

  try {
    const factures = await Facture.findAll({
      where: {
        date_facture: {
          [Op.between]: [
            `${year}-${month}-01`,
            `${year}-${month}-31`
          ]
        }
      }
    });

    let total = 0;
    let paye = 0;
    let enAttente = 0;

    factures.forEach(f => {
      total += parseFloat(f.montant);

      if (f.statut === "payee") paye += parseFloat(f.montant);
      if (f.statut === "en_attente" || f.statut === "partielle") {
        enAttente += parseFloat(f.montant);
      }
    });

    res.json({
      total,
      paye,
      enAttente,
      nb_factures: factures.length
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};