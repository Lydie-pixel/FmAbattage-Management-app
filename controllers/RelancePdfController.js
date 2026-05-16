const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { Relance, Facture, Client, Paiement } = require("../models");

exports.generateRelancePDF = async (req, res) => {
  try {
    const relance = await Relance.findByPk(req.params.id, {
      include: [
        {
          model: Facture,
          as: "facture",
          include: [
            { model: Client, as: "client" },
            { model: Paiement, as: "paiements" }
          ]
        }
      ]
    });

    if (!relance) {
      return res.status(404).json({ error: "Relance introuvable" });
    }

    const facture = relance.facture;

    // Calcul paiements
    let totalPaye = 0;
    facture.paiements?.forEach(p => {
      totalPaye += Number(p.montant);
    });

    const reste = Number(facture.montant) - totalPaye;

    // Charger template selon niveau
    let templatePath = "";

    switch (relance.niveau) {
      case "relance_1":
        templatePath = path.join(__dirname, "../templates/pages/relance1.html");
        break;
      case "relance_2":
        templatePath = path.join(__dirname, "../templates/pages/relance2.html");
        break;
      case "relance_3":
        templatePath = path.join(__dirname, "../templates/pages/relance3.html");
        break;
      case "mise_en_demeure":
        templatePath = path.join(__dirname, "../templates/pages/mise_en_demeure.html");
        break;
    }

    let html = fs.readFileSync(templatePath, "utf8");

    // Helpers
    const formatDate = (d) =>
      d ? new Date(d).toLocaleDateString("fr-FR") : "";

    const formatPrice = (v) =>
      Number(v || 0).toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
      }) + " €";

    // Remplacer les variables
    html = html
      .replaceAll("{{client_nom}}", facture.client?.nom || "")
      .replaceAll("{{client_tel}}", facture.client?.tel || "")
      .replaceAll("{{client_adresse}}", facture.client?.adresse || "")
      .replaceAll("{{client_code_postal}}", facture.client?.code_postal || "")
      .replaceAll("{{client_ville}}", facture.client?.ville || "")
      .replaceAll("{{numero_facture}}", facture.numero || "")
      .replaceAll("{{date_facture}}", formatDate(facture.date_facture))
      .replaceAll("{{montant_facture}}", formatPrice(facture.montant))
      .replaceAll("{{date_relance}}", formatDate(relance.date_relance))
      .replaceAll("{{penalites}}", formatPrice(relance.penalites))
      .replaceAll("{{ar}}", relance.numero_ar || "")
      .replaceAll("{{delai_avant_poursuite}}", relance.delai_avant_poursuite || "")
      .replaceAll("{{reste_du}}", formatPrice(reste));

    // PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "load" });

    const filePath = path.join(
      __dirname,
      "../uploads",
      `relance_${facture.numero}.pdf`
    );

    await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true,
      margin: {
        top: "15mm",
        left: "10mm",
        right: "10mm",
      },
    });

    await browser.close();

    return res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};