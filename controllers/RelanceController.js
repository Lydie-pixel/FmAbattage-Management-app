const { Relance, Facture, Client, Devis, Paiement } = require("../models");

exports.getAllRelance = async (req, res) => {

  try {

    const relances = await Relance.findAll({

        include: [

            {
            model: Facture,
            as: "facture",

                include: [

                    {
                    model: Client,
                    as: "client"
                    },

                    {
                    model: Devis,
                    as: "devis"
                    },

                    {
                    model: Paiement,
                    as: "paiements"
                    }

                ]
            }

        ]

    });

    res.json(relances);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

exports.createRelance = async (req, res) => {

  try {

    const facture = await Facture.findByPk(
      req.body.facture_id
    );

    if (!facture) {
      return res.status(404).json({
        error: "Facture non trouvée"
      });
    }

    if (facture.statut === "payee") {
      return res.status(400).json({
        error: "Impossible de relancer une facture payée"
      });
    }

    // récupérer les relances existantes
    const relancesExistantes = await Relance.findAll({
      where: {
        facture_id: req.body.facture_id
      }
    });

    // empêcher doublons
    const dejaExiste = relancesExistantes.find(
      r => r.niveau === req.body.niveau
    );

    if (dejaExiste) {
      return res.status(400).json({
        error: "Cette relance existe déjà"
      });
    }

    // ordre logique
    if (
      req.body.niveau === "relance_2" &&
      !relancesExistantes.find(
        r => r.niveau === "relance_1"
      )
    ) {
      return res.status(400).json({
        error: "Relance 1 obligatoire avant relance 2"
      });
    }

    if (
      req.body.niveau === "relance_3" &&
      !relancesExistantes.find(
        r => r.niveau === "relance_2"
      )
    ) {
      return res.status(400).json({
        error: "Relance 2 obligatoire avant relance 3"
      });
    }

    if (
      req.body.niveau === "mise_en_demeure" &&
      !relancesExistantes.find(
        r => r.niveau === "relance_3"
      )
    ) {
      return res.status(400).json({
        error: "Relance 3 obligatoire avant mise en demeure"
      });
    }

    const relance = await Relance.create(req.body);

    res.status(201).json(relance);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

exports.getRelanceById = async (req, res) => {
  try {
    const relance = await Relance.findByPk(req.params.id);

    if (!relance) {
      return res.status(404).json({ error: "Relance non trouvée" });
    }

    res.json(relance);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.updateRelance = async (req, res) => {

  try {

    const relance = await Relance.findByPk(req.params.id);

    if (!relance) {
      return res.status(404).json({
        error: "Relance non trouvée"
      });
    }

    await relance.update(req.body);

    res.json(relance);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

exports.deleteRelance = async (req, res) => {

  try {

    const relance = await Relance.findByPk(req.params.id);

    if (!relance) {
      return res.status(404).json({
        error: "Relance non trouvée"
      });
    }

    await relance.destroy();

    res.json({
      message: "Relance supprimée"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};