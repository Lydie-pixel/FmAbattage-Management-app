const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { Devis, Client, DevisItem } = require("../models");

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
    let html = fs.readFileSync("./templates/devis.html", "utf8");

    // ✅ 3. remplacer les variables
    html = html.replace("{{client_nom}}", devis.client.nom);
    html = html.replace("{{client_tel}}", devis.client.tel || "");
    html = html.replace("{{client_adresse}}", devis.client.adresse || "");
    html = html.replace("{{numero}}", devis.numero);
    html = html.replace("{{date_devis}}", devis.date_devis);
    html = html.replace("{{date_echeance}}", devis.date_echeance);
    html = html.replace("{{frais}}", devis.frais_deplacement + " €");
    html = html.replace("{{total}}", devis.montant + " €");

    // ✅ 4. générer les lignes
    const itemsHTML = devis.items.map(item => `
      <tr>
        <td>${item.description}</td>
        <td>${item.prix_unitaire} €</td>
        <td>${item.quantite}</td>
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
      format: "A4"
    });

    await browser.close();

    // ✅ 6. réponse
    res.sendFile(filePath);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};