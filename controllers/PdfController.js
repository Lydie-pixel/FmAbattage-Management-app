const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { Devis, Client, DevisItem } = require("../models");

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR");
}

exports.generateDevisPDF = async (req, res) => {
  try {

    // ✅ 1. récupérer le devis AVANT tout
    const devis = await Devis.findByPk(req.params.id, {
      include: [
        { model: Client, as: "client" },
        { model: DevisItem, as: "items" }
      ]
    });

    if (!devis) {
      return res.status(404).json({ error: "Devis non trouvé" });
    }

    // ✅ 2. charger le template
    function formatDate(date) {
      const d = new Date(date);
      return d.toLocaleDateString("fr-FR");
    }
    function formatPrice(value) {
      return Number(value).toLocaleString("fr-FR", {
        minimumFractionDigits: 2
      }) + " €";
    }
    let html = fs.readFileSync("./templates/devis.html", "utf8");

    const css = fs.readFileSync("./asset/css/Devis.css", "utf8");
    html = `
    <style>${css}</style>
    ${html}
    `;

    const logoPath = path.join(__dirname, "../asset/img/logo.png");
const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });

    // ✅ 3. remplacer les variables
    html = html.replace("{{logo}}", logoBase64);
    html = html.replace("{{client_nom}}", devis.client.nom);
    html = html.replace("{{client_tel}}", devis.client.tel || "");
    html = html.replace("{{client_adresse}}", devis.client.adresse || "");
html = html.replaceAll("{{client_code_postal}}", devis.client.code_postal || "");
html = html.replaceAll("{{client_ville}}", devis.client.ville || "");
    html = html.replace("{{client_email}}", devis.client.email || "");
    html = html.replace("{{numero}}", devis.numero);
   html = html.replaceAll("{{date_devis}}", formatDate(devis.date_devis));
    html = html.replace("{{date_echeance}}", formatDate(devis.date_echeance));
    html = html.replace("{{frais}}", devis.frais_deplacement + " €");
    html = html.replaceAll("{{total}}", devis.montant);

    // ✅ 4. générer les lignes
    const itemsHTML = devis.items.map(item => `
      <tr>
        <td>${item.description}</td>
        <td>${item.quantite}</td>
        <td>${item.prix_unitaire} €</td>
        <td>${item.prix_unitaire * item.quantite} €</td>
      </tr>
    `).join("");

    html = html.replace("{{items}}", itemsHTML);

    // ✅ 5. Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html);

    const filePath = path.join(__dirname, "../uploads", `devis_${devis.numero}.pdf`);

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

    // ✅ 6. réponse
    res.sendFile(filePath);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.generateDevisPDFInternal = async (id) => {

  const devis = await Devis.findByPk(id, {
    include: [
      { model: Client, as: "client" },
      { model: DevisItem, as: "items" }
    ]
  });

  let html = fs.readFileSync("./templates/devis.html", "utf8");

  const css = fs.readFileSync("./asset/css/Devis.css", "utf8");
  html = `<style>${css}</style>${html}`;

    // ✅ 3. remplacer les variables
    html = html.replace("{{client_nom}}", devis.client.nom);
    html = html.replace("{{client_tel}}", devis.client.tel || "");
    html = html.replace("{{client_adresse}}", devis.client.adresse || "");
html = html.replaceAll("{{client_code_postal}}", devis.client.code_postal || "");
html = html.replaceAll("{{client_ville}}", devis.client.ville || "");
    html = html.replace("{{client_email}}", devis.client.email || "");
    html = html.replace("{{numero}}", devis.numero);
   html = html.replaceAll("{{date_devis}}", formatDate(devis.date_devis));
    html = html.replace("{{date_echeance}}", formatDate(devis.date_echeance));
    html = html.replace("{{frais}}", devis.frais_deplacement + " €");
    html = html.replaceAll("{{total}}", devis.montant);

    // ✅ 4. générer les lignes
    const itemsHTML = devis.items.map(item => `
      <tr>
        <td>${item.description}</td>
        <td>${item.quantite}</td>
        <td>${item.prix_unitaire} €</td>
        <td>${item.prix_unitaire * item.quantite} €</td>
      </tr>
    `).join("");

    html = html.replace("{{items}}", itemsHTML);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html);

  const filePath = path.join(__dirname, "../uploads", `devis_${devis.numero}.pdf`);

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