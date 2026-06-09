import { Parser } from 'json2csv';
import fs from 'fs';

async function exportFactures() {

  const response = await fetch('/api/export/facturesex');

  const data = await response.json();

  const fields = [

    {
      label: 'Date de facturation',
      value: 'date_facture'
    },

    {
      label: 'Numéro de facture',
      value: 'numero'
    },

    {
      label: 'Numéro de devis',
      value: 'devis.numero'
    },

    {
      label: 'Montant de la facture',
      value: row => `${row.montant}€`
    },

    {
      label: 'Frais de déplacements',
      value: row => `${row.frais_deplacement_final}€`
    },

    {
      label: 'Nom du client',
      value: 'devis.client.nom'
    },

    {
      label: 'Date de paiement',
      value: 'paiement.date_paiement'
    },

    {
      label: 'Montant payé',
      value: row => `${row.paiement.montant}€`
    },

    {
      label: 'Mode de paiement',
      value: 'paiement.mode_paiement'
    }
  ];

  const parser = new Parser({ fields });

  const csv = parser.parse(data);

  fs.writeFileSync(
    'factures.csv',
    '\uFEFF' + csv
  );

  console.log('Export terminé');
}

exportFactures();

async function exportDepenses() {

  const response = await fetch('/api/export/depensesex');
    const data = await response.json();

        const fields = [

        {
            label: 'Date dépense',
            value: 'date'
        },

        {
            label: 'Montant',
            value: row => `${row.montant}€`
        },

        {
            label: 'Type dépense',
            value: 'type'
        },

        {
            label: 'Description',
            value: 'description'
        }
    ];

    const parser = new Parser({ fields });

  const csv = parser.parse(data);

  fs.writeFileSync(
    'depenses.csv',
    '\uFEFF' + csv
  );

  console.log('Export terminé ');
}
exportDepenses();

async function exportRelances() {

  const response = await fetch('/api/export/relancesex');
    const data = await response.json();
        const fields = [

           {
      label: 'Date de relance',
      value: 'date_relance'
    },

    {
      label: 'Niveau de relance',
      value: 'niveau_relance'
    },

    {
      label: 'Pénalités',
      value: row => `${row.montant}€`
    },

    {
      label: 'Numéro de facture',
      value: 'numero'
    },

    {
      label: 'Numéro de devis',
      value: 'numero'
    },

    {
        label: 'Nom du client',
      value: 'devis.client.nom'
    },

    {
      label: 'Montant de la facture',
      value: row => `${row.montant}€`
    },

    {
      label: 'Date de facture',
      value: 'paiement.date_facture'
    },

    {
      label: 'Montant payé',
      value: row => `${row.paiement.montant}€`
    },

    {
      label: 'Mode de paiement',
      value: 'paiement.mode_paiement'
    }
  ];

  const parser = new Parser({ fields });

  const csv = parser.parse(data);

  fs.writeFileSync(
    'factures.csv',
    '\uFEFF' + csv
  );

  console.log('Export terminé');
}