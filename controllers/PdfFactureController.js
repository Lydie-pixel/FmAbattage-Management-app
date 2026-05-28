const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");
const { Facture, Devis, Client, DevisItem } = require("../models");

function getDelaiPaiement(dateFacture, dateEcheance) {
  const d1 = new Date(dateFacture);
  const d2 = new Date(dateEcheance);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

exports.generateFacturePDF = async (req, res) => {
  try {

    // 1. récupérer la facture AVANT tout
    const facture = await Facture.findByPk(req.params.id, {
    include: [
        { model: Client, as: "client" },
        {
        model: Devis,
        as: "devis",
        include: [{ model: DevisItem, as: "items" }]
        }
    ]
    });

    if (!facture) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }

    // 2. charger le template
    function formatDate(date) {
      const d = new Date(date);
      return d.toLocaleDateString("fr-FR");
    }
    function formatPrice(value) {
      return Number(value).toLocaleString("fr-FR", {
        minimumFractionDigits: 2
      }) + " €";
    }
    let html = fs.readFileSync("./templates/pages/facture.html", "utf8");

    const css = fs.readFileSync("./templates/asset/css/Facture.css", "utf8");
    html = `
    <style>${css}</style>
    ${html}
    `;

    const logoPath = path.join(__dirname, "../templates/asset/img/logo.png");
const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });

const echeance = new Date(facture.date_facture);
echeance.setDate(echeance.getDate() + 30);

    // 3. remplacer les variables
    html = html.replace("{{logo}}", logoBase64);
    html = html.replace("{{client_nom}}", facture.client.nom);
    html = html.replace("{{client_tel}}", facture.client.tel || "");
    html = html.replace("{{client_adresse}}", facture.client.adresse || "");
    html = html.replaceAll("{{client_code_postal}}", facture.client.code_postal || "");
    html = html.replaceAll("{{client_ville}}", facture.client.ville || "");
    html = html.replace("{{client_email}}", facture.client.email || "");
    html = html.replace("{{numero}}", facture.numero);
    html = html.replaceAll("{{date_facture}}", formatDate(facture.date_facture));
    html = html.replace("{{date_echeance}}", formatDate(echeance));
    html = html.replace("{{frais}}", formatPrice(facture.frais_deplacement_final));
    html = html.replaceAll("{{total}}", formatPrice(facture.montant));
    html = html.replace("{{delai_paiement}}", getDelaiPaiement(facture.date_facture, echeance) + " jours");
    // 4. générer les lignes
const items = facture.devis?.items || [];

const itemsHTML = items.map(item => `
  <tr>
    <td>${item.description}</td>
    <td>${item.quantite}</td>
    <td>${formatPrice(item.prix_unitaire)}</td>
    <td>${formatPrice(item.prix_unitaire * item.quantite)}</td>
  </tr>
`).join("");

    html = html.replace("{{items}}", itemsHTML);

    // 5. Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox"
      ]
    });
    const page = await browser.newPage();

    await page.setContent(html);

    const filePath = path.join(__dirname, "../uploads", `facture_${facture.numero}.pdf`);

    await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true,
        margin: {
          top: "15mm",
          left: "10mm",
          right: "10mm"
        }
    });

    await browser.close();

    //  6. réponse
    res.sendFile(filePath);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.generateFacturePDFInternal = async (id) => {

    const facture = await Facture.findByPk(req.params.id, {
    include: [
        { model: Client, as: "client" },
        {
        model: Devis,
        as: "devis",
        include: [{ model: DevisItem, as: "items" }]
        }
    ]
    });

  let html = fs.readFileSync("./templates/pages/facture.html", "utf8");

  const css = fs.readFileSync("./templates/asset/css/Facture.css", "utf8");
  html = `<style>${css}</style>${html}`;
const echeance = new Date(facture.date_facture);
echeance.setDate(echeance.getDate() + 20);

    // 3. remplacer les variables
    html = html.replace("{{client_nom}}", facture.client.nom);
    html = html.replace("{{client_tel}}", facture.client.tel || "");
    html = html.replace("{{client_adresse}}", facture.client.adresse || "");
    html = html.replaceAll("{{client_code_postal}}", facture.client.code_postal || "");
    html = html.replaceAll("{{client_ville}}", facture.client.ville || "");
    html = html.replace("{{client_email}}", facture.client.email || "");
    html = html.replace("{{numero}}", facture.numero);
    html = html.replaceAll("{{date_facture}}", formatDate(facture.date_facture));
    html = html.replace("{{date_echeance}}", formatDate(echeance));
    html = html.replace("{{frais}}", formatPrice(facture.frais_deplacement_final));
    html = html.replaceAll("{{total}}", formatPrice(facture.montant));

    // 4. générer les lignes
  const items = facture.devis?.items || [];

  const itemsHTML = items.map(item => `
    <tr>
      <td>${item.description}</td>
      <td>${item.quantite}</td>
      <td>${formatPrice(item.prix_unitaire)}</td>
      <td>${formatPrice(item.prix_unitaire * item.quantite)}</td>
    </tr>
  `).join("");

    html = html.replace("{{items}}", itemsHTML);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ]
  });
  const page = await browser.newPage();

  await page.setContent(html);

  const filePath = path.join(__dirname, "../uploads", `facture_${facture.numero}.pdf`);

    await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true,
        margin: {
          top: "15mm",
          left: "10mm",
          right: "10mm"
        }
    });

  await browser.close();

  return filePath;
};