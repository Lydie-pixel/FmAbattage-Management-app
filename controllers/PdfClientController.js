const fs = require("fs");
const path = require("path");
const { Client, Devis, Facture, Paiement, Relance } = require("../models");
const launchBrowser = require("../config/puppeteer");

exports.generateClientPDF = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id, {
      include: [
        { model: Devis, as: "devis" },
        {
          model: Facture,
          as: "factures",
          include: [
            { model: Paiement, as: "paiements" },
            { model: Relance, as: "relances" }
          ]
        }
      ]
    });

    if (!client) {
      return res.status(404).json({ error: "Client introuvable" });
    }

    // --------------------
    // HELPERS
    // --------------------
    const formatDate = (d) =>
      d ? new Date(d).toLocaleDateString("fr-FR") : "";

    // ===== PRIX =====
    const formatPrice = (value) => {
        return Number(value || 0)
            .toLocaleString(
                "fr-FR",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )
        + " €";
    }

    // ===== RELANCES =====
    const formatNiveau = (niveau) => {
        switch (niveau) {
            case "relance_1": return "Première relance";
            case "relance_2": return "Deuxième relance";
            case "relance_3": return "Troisième relance";
            case "mise_en_demeure": return "Mise en demeure";
            default: return niveau;
        }
    }

    // ===== MODE DE PAIEMENT =====
    const formatMode = (mode_paiement) => {
        switch (mode_paiement) {
            case "virement_A": return "Virement compte Nickel";
            case "virement_B": return "Virement compte Sumup";
            case "cb": return "Carte Bancaire";
            case "cheque": return "Chèque";
            case "especes": return "Espèces";
            case "autre": return "Autre";
            default: return mode_paiement;
        }
    }

    // ===== STATUT DES RELANCES =====
    const formatStatut = (niveau) => {
        switch (niveau) {
            case "envoyee": return "Envoyée";
            case "payee": return "Payée";
            case "procedure": return "En procédure";
            case "annulee": return "Annulée";
            case "en_attente": return "En attente";
            case "accepte": return "Acceptée";
            case "refuse": return "Refusée";
            default: return niveau;
        }
    }
    // --------------------
    // DEVIS
    // --------------------
    let devisRows = "";

    if (!client.devis || client.devis.length === 0) {
      devisRows = `<tr><td colspan="4">Aucun devis</td></tr>`;
    } else {
      client.devis.forEach(d => {
        devisRows += `
          <tr>
            <td>${d.numero}</td>
            <td>${formatDate(d.date)}</td>
            <td>${formatPrice(d.montant)}</td>
            <td>${formatStatut(d.statut)}</td>
          </tr>
        `;
      });
    }

    // --------------------
    // FACTURES
    // --------------------
    let factureRows = "";

    if (!client.factures || client.factures.length === 0) {
      factureRows = `<tr><td colspan="4">Aucune facture</td></tr>`;
    } else {
      client.factures.forEach(f => {
        factureRows += `
          <tr>
            <td>${f.numero}</td>
            <td>${formatDate(f.date_facture)}</td>
            <td>${formatPrice(f.montant)}</td>
            <td>${formatStatut(f.statut)}</td>
          </tr>
        `;
      });
    }

    // --------------------
    // PAIEMENTS
    // --------------------
    let paiementRows = "";

    let hasPaiement = false;

    if (client.factures && client.factures.length > 0) {
      client.factures.forEach(f => {
        (f.paiements || []).forEach(p => {
          hasPaiement = true;
          paiementRows += `
            <tr>
              <td>${f.numero}</td>
              <td>${formatDate(p.date_paiement)}</td>
              <td>${formatPrice(p.montant)}</td>
              <td>${formatMode(p.mode_paiement)}</td>
            </tr>
          `;
        });
      });
    }

    if (!hasPaiement) {
      paiementRows = `<tr><td colspan="4">Aucun paiement</td></tr>`;
    }

    // --------------------
    // RELANCES
    // --------------------
    let relanceRows = "";

    let hasRelance = false;

    if (client.factures && client.factures.length > 0) {
      client.factures.forEach(f => {
        (f.relances || []).forEach(r => {
          hasRelance = true;
          relanceRows += `
            <tr>
              <td>${f.numero}</td>
              <td>${formatNiveau(r.niveau)}</td>
              <td>${formatDate(r.date_relance)}</td>
              <td>${formatPrice(r.penalites)}</td>
            </tr>
          `;
        });
      });
    }

    if (!hasRelance) {
      relanceRows = `<tr><td colspan="4">Aucune relance</td></tr>`;
    }

    // --------------------
    // COMMENTAIRE
    // --------------------
    const commentaireFinal =
      client.commentaire?.trim()
        ? client.commentaire
        : "Aucun commentaire pour le moment.";

    // --------------------
    // TEMPLATE
    // --------------------
    const templatePath = path.join(
      __dirname,
      "../templates/pages/client.html"
    );

    let html = fs.readFileSync(templatePath, "utf8");

    const css = fs.readFileSync(
      "./templates/asset/css/Client.css",
      "utf8"
    );

    html = `<style>${css}</style>${html}`;

    // --------------------
    // VARIABLES
    // --------------------
    html = html
      .replaceAll("{{client_nom}}", client.nom || "")
      .replaceAll("{{client_tel}}", client.tel || "")
      .replaceAll("{{client_email}}", client.email || "")
      .replaceAll("{{client_adresse}}", client.adresse || "")
      .replaceAll("{{client_ville}}", client.ville || "")
      .replaceAll("{{client_code_postal}}", client.code_postal || "")
      .replaceAll("{{client_commentaire}}", commentaireFinal)
      .replaceAll("{{devis_rows}}", devisRows)
      .replaceAll("{{facture_rows}}", factureRows)
      .replaceAll("{{paiement_rows}}", paiementRows)
      .replaceAll("{{relance_rows}}", relanceRows);

    // --------------------
    // PUPPETEER
    // --------------------

const browser = await launchBrowser();
const page = await browser.newPage();

await page.setContent(html, { waitUntil: "networkidle0" });

const filePath = path.join(__dirname, "../uploads", `Client_${client.id}.pdf`);

await page.pdf({
  path: filePath,
  format: "A4",
  printBackground: true,
  margin: {
        top: "8mm",
        left: "10mm",
        right: "10mm",
        bottom: "8mm"
      }
});

await browser.close();

return res.sendFile(filePath);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};