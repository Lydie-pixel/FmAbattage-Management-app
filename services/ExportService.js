const { Parser } = require('json2csv');
const sequelize = require('../config/database');

const { QueryTypes } = require('sequelize');


// =========================
// EXPORT FACTURES
// =========================

const exportFactures = async () => {

  const sql = `
    SELECT
      f.date_facture AS 'Date de facturation',

      f.numero AS 'Numéro de facture',

      d.numero AS 'Numéro de devis',

      CONCAT(f.montant, '€')
        AS 'Montant de la facture',

      CONCAT(f.frais_deplacement_final, '€')
        AS 'Frais de déplacements',

      c.nom AS 'Nom du client',

      p.date_paiement AS 'Date de paiement',

      CONCAT(p.montant, '€')
        AS 'Montant payé',

      p.mode_paiement AS 'Mode de paiement'

    FROM Factures f

    INNER JOIN devis d
      ON d.id = f.devis_id

    INNER JOIN Clients c
      ON c.id = d.client_id

    INNER JOIN Paiements p
      ON p.facture_id = f.id
  `;

  const results = await sequelize.query(
    sql,
    {
      type: QueryTypes.SELECT
    }
  );

  const parser = new Parser({
    delimiter: ';'
    });

  return parser.parse(results);
};


module.exports = {
  exportFactures
};




// =========================
// EXPORT DEPENSES
// =========================

const exportDepenses = async () => {

  const sql = `
      SELECT
        d.date AS 'Date dépense',
        CONCAT(d.montant, '€') AS 'Montant',
        d.type AS 'Type dépense',
        d.description AS 'Description'

      FROM depenses d

      ORDER BY d.date ASC
    `;

    const results = await sequelize.query(sql, {
      type: QueryTypes.SELECT
    });

      const parser = new Parser({
        delimiter: ';'
        });

    return parser.parse(results);
};


// =========================
// EXPORT RELANCES
// =========================

const exportRelances = async () => {

  const sql = `
      SELECT
        r.date_relance AS 'Date de relance',
        r.niveau AS 'Niveau de relance',
        CONCAT(r.penalites, '€') AS 'Montant de pénalité',

        f.numero AS 'Numéro de facture',
        d.numero AS 'Numéro de devis',

        c.nom AS 'Client',

        CONCAT(f.montant, '€') AS 'Montant de la facture',

        f.date_facture AS 'Date de facture',

        CONCAT(f.frais_deplacement_final, '€')
          AS 'Frais de déplacement'

      FROM Factures f

      LEFT JOIN relances r
        ON f.id = r.facture_id

      INNER JOIN devis d
        ON d.id = f.devis_id

      INNER JOIN Clients c
        ON c.id = d.client_id
    `;

    const results = await sequelize.query(sql, {
      type: QueryTypes.SELECT
    });

      const parser = new Parser({
        delimiter: ';'
        });

    return parser.parse(results);
};

// =========================
// EXPORT CUMUL DES DEPENSES PAR TYPE
// =========================

const exportDepensesParType = async () => {

    const sql = `
      SELECT
        CONCAT(SUM(d.montant), '€') AS 'Montant',
        d.type AS 'Type dépense'

      FROM depenses d

      GROUP BY d.type
    `;

    const results = await sequelize.query(sql, {
      type: QueryTypes.SELECT
    });

      const parser = new Parser({
        delimiter: ';'
        });

    return parser.parse(results);
};



module.exports = {
  exportFactures,
  exportDepenses,
  exportRelances,
  exportDepensesParType
};
