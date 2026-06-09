const fs = require("fs");
const path = require("path");
const { Devis, Client, DevisItem } = require("../models");
const launchBrowser = require("../config/puppeteer");

function formatDate(date) {
  return date ? new Date(date).toLocaleDateString("fr-FR") : "";
}

function formatPrice(value) {
  return Number(value || 0).toLocaleString("fr-FR", {
    minimumFractionDigits: 2
  }) + " €";
}

function getDelai(dateDevis, dateEcheance) {
  const d1 = new Date(dateDevis);
  const d2 = new Date(dateEcheance);
  return Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
}

exports.generateDevisPDF = async (req, res) => {
  try {
    const devis = await Devis.findByPk(req.params.id, {
      include: [
        { model: Client, as: "client" },
        { model: DevisItem, as: "items" }
      ]
    });

    if (!devis) {
      return res.status(404).json({ error: "Devis non trouvé" });
    }

    let html = fs.readFileSync(
      path.join(__dirname, "../templates/pages/devis.html"),
      "utf8"
    );

    const css = fs.readFileSync(
      path.join(__dirname, "../templates/asset/css/Devis.css"),
      "utf8"
    );

    html = `<style>${css}</style>${html}`;

    const logoPath = path.join(__dirname, "../templates/asset/img/logo.png");
    const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });


    // Items
    const itemsHTML = (devis.items || []).map(item => `
      <tr>
        <td>${item.description}</td>
        <td>${item.quantite}</td>
        <td>${formatPrice(item.prix_unitaire)}</td>
        <td>${formatPrice(item.prix_unitaire * item.quantite)}</td>
      </tr>
    `).join("");

    html = html
      .replace("{{client_nom}}", devis.client?.nom || "")
      .replace("{{client_tel}}", devis.client?.tel || "")
      .replace("{{client_adresse}}", devis.client?.adresse || "")
      .replace("{{client_code_postal}}", devis.client?.code_postal || "")
      .replace("{{client_ville}}", devis.client?.ville || "")
      .replace("{{client_email}}", devis.client?.email || "")
      .replace("{{numero}}", devis.numero || "")
      .replace("{{date_devis}}", formatDate(devis.date_devis))
      .replace("{{date_echeance}}", formatDate(devis.date_echeance))
      .replace("{{frais}}", formatPrice(devis.frais_deplacement))
      .replace("{{total}}", formatPrice(devis.montant))
      .replace("{{delai}}", getDelai(devis.date_devis, devis.date_echeance))
      .replace("{{items}}", itemsHTML)
      .replace("{{logo}}", logoBase64);

const browser = await launchBrowser();
const page = await browser.newPage();

await page.setContent(html, { waitUntil: "networkidle0" });

filePath = path.join(__dirname, "../uploads", `devis_${devis.id}.pdf`);

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

exports.generateDevisPDFInternal = async (id) => {

  try{

  const devis = await Devis.findByPk(id, {
    include: [
      { model: Client, as: "client" },
      { model: DevisItem, as: "items" }
    ]
  });

  let html = fs.readFileSync("./templates/pages/devis.html", "utf8");

  const css = fs.readFileSync("./templates/asset/css/Devis.css", "utf8");
  html = `<style>${css}</style>${html}`;

      const logoPath = path.join(__dirname, "../templates/asset/img/logo.png");
  const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });


    // 3. remplacer les variables
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
    html = html.replace("{{logo}}", logoBase64);

    // 4. générer les lignes
    const itemsHTML = devis.items.map(item => `
      <tr>
        <td>${item.description}</td>
        <td>${item.quantite}</td>
        <td>${item.prix_unitaire} €</td>
        <td>${item.prix_unitaire * item.quantite} €</td>
      </tr>
    `).join("");

    html = html.replace("{{items}}", itemsHTML);

const browser = await launchBrowser();
const page = await browser.newPage();

await page.setContent(html, { waitUntil: "networkidle0" });

const filePath = path.join(__dirname, "../uploads", `file.pdf`);

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
