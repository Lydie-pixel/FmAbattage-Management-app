const Paiement = require("../models/PaiementModel");
const { Facture, Client } = require("../models");
const sequelize = require("../config/database");
const { Op } = require("sequelize");

exports.getAllPaiements = async (req, res) => {
  try {
    const paiements = await Paiement.findAll({
      include: [{
        model: Facture,
        as: "facture",
        attributes: ["numero", "montant", "client_id"],
        include: [{
          model: Client,
          as: "client",
          attributes: ["nom"]
        }]
      }],
      order: [["date_paiement", "DESC"]]
    });
    res.json(paiements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPaiementById = async (req, res) => {
    const { id } = req.params;
    try {
     const paiement = await Paiement.findByPk(id);
     if (!paiement) {
        return res.status(404).json({ error: "Paiement non trouvé" });
     }
        res.json(paiement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMonthlyRevenue = async (req, res) => {
  const { year, month } = req.params;

  try {
    const paiements = await Paiement.findAll({
      where: {
        date_paiement: {
          [Op.between]: [
            `${year}-${month}-01`,
            `${year}-${month}-31`
          ]
        }
      }
    });

    let total = 0;

    paiements.forEach(p => {
      total += parseFloat(p.montant);
    });

    res.json({
      mois: `${month}/${year}`,
      total_encaisse: total,
      nb_paiements: paiements.length
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPaiement = async (req, res) => {
  const { facture_id, montant, mode_paiement, date_paiement } = req.body;

  try {
    const facture = await Facture.findByPk(facture_id, {
      include: [{ model: Paiement, as: "paiements" }]
    });

    if (!facture) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }

    //calcul déjà payé
    let totalPaye = 0;
    facture.paiements.forEach(p => {
      totalPaye += parseFloat(p.montant);
    });

    const reste = facture.montant - totalPaye;
    const montantNumber = parseFloat(montant);

    if (montantNumber > reste) {
      return res.status(400).json({
        error: "Montant supérieur au reste à payer"
      });
    }

    // création paiement
    const paiement = await Paiement.create({
      facture_id,
      montant: montantNumber,
      mode_paiement,
      date_paiement
    });

    // mise à jour statut facture
    const nouveauTotal = totalPaye + montantNumber;

    if (Math.abs(nouveauTotal - facture.montant) < 0.01) {
      facture.statut = "payee";
    } else {
      facture.statut = "partielle";
    }

    await facture.save();

    res.status(201).json({
      message: "Paiement ajouté",
      paiement,
      statut_facture: facture.statut
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePaiement = async (req, res) => {
  try {

    const paiement = await Paiement.findByPk(req.params.id);

    if (!paiement) {
      return res.status(404).json({
        error: "Paiement non trouvé"
      });
    }

    const { montant, mode_paiement, date_paiement } = req.body;

    const montantNumber = parseFloat(montant);

    // Sauvegarde de l'ancien montant
    const ancienMontant =
      parseFloat(paiement.montant);

    const facture = await Facture.findByPk(
      paiement.facture_id,
      {
        include: [{
          model: Paiement,
          as: "paiements"
        }]
      }
    );

    let totalPaye = 0;

    facture.paiements.forEach(p => {
      totalPaye += parseFloat(p.montant);
    });

    const nouveauTotal =
      totalPaye - ancienMontant + montantNumber;

    if (nouveauTotal > facture.montant) {
      return res.status(400).json({
        error: "Montant supérieur au reste à payer"
      });
    }

    // Modification seulement après validation
    if (montant !== undefined) {
      paiement.montant = montantNumber;
    }

    if (mode_paiement !== undefined) {
      paiement.mode_paiement = mode_paiement;
    }

    if (date_paiement !== undefined) {
      paiement.date_paiement = date_paiement;
    }

    await paiement.save();

    // Recalcul du total payé
    const paiements = await Paiement.findAll({
      where: {
        facture_id: paiement.facture_id
      }
    });

    let total = 0;

    paiements.forEach(p => {
      total += parseFloat(p.montant);
    });

    if (Math.abs(total - facture.montant) < 0.01) {
      facture.statut = "payee";
    } else if (total > 0) {
      facture.statut = "partielle";
    } else {
      facture.statut = "en_attente";
    }

    await facture.save();

    res.json({
      message: "Paiement modifié",
      paiement
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.deletePaiement = async (req, res) => {
  try {
    const paiement = await Paiement.findByPk(req.params.id);

    if (!paiement) {
      return res.status(404).json({ error: "Paiement non trouvé" });
    }

    const factureId = paiement.facture_id;

    await paiement.destroy();

    // recalcul facture
    const paiements = await Paiement.findAll({
      where: { facture_id: factureId }
    });

    let total = 0;
    paiements.forEach(p => {
      total += parseFloat(p.montant);
    });

    const facture = await Facture.findByPk(factureId);

    if (total === 0) {
      facture.statut = "en_attente";
    } else if (Math.abs(total - facture.montant) < 0.01) {
      facture.statut = "payee";
    } else {
      facture.statut = "partielle";
    }

    await facture.save();

    res.json({ message: "Paiement supprimé" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};