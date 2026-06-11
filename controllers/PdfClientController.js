const fs = require("fs");
const path = require("path");
const { Client, Devis, Facture, Paiement, Relance } = require("../models");
const launchBrowser = require("../config/puppeteer");

exports.generateClientPDF = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id, {
    });

    if (!client) {
      return res.status(404).json({ error: "Client introuvable" });
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