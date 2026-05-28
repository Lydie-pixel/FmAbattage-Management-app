const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
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
            { 
                model: Client, 
                as: "client" 
            },
            { 
                model: Paiement, 
                as: "paiements" 
            },
            {
                model: Relance,
                as: "relances"
            }
          ]
        }
      ]
    });

    if (!relance) {
      return res.status(404).json({ error: "Relance introuvable" });
    }

    const facture = relance.facture;

    const relance1 = facture.relances?.find(
        r => r.niveau === "relance_1"
        );

        const relance2 = facture.relances?.find(
        r => r.niveau === "relance_2"
        );

        const relance3 = facture.relances?.find(
        r => r.niveau === "relance_3"
    );

    // Helpers
    const formatDate = (d) =>
      d ? new Date(d).toLocaleDateString("fr-FR") : "";

    const formatPrice = (v) =>
      Number(v || 0).toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
      }) + " €";


    // Calcul paiements
    let totalPaye = 0;
    facture.paiements?.forEach(p => {
      totalPaye += Number(p.montant);
    });

    const reste = Number(facture.montant) - totalPaye;

    const hasPaiementPartiel =
      totalPaye > 0 && reste > 0;
      let paiementPartielTexte = "";
        if (hasPaiementPartiel) {
          paiementPartielTexte = `
            <p>
              Nous avons bien pris en compte un règlement partiel
              d’un montant de ${formatPrice(totalPaye)}.
            </p>

            <p>
              Toutefois, un solde restant dû de
              ${formatPrice(reste)}
              demeure impayé au titre cette facture.
            </p>
          `;
        }

      let paiementPartielTexteDemeure = "";
      if (hasPaiementPartiel) {
        paiementPartielTexteDemeure = `
          <p>
            Et malgré un règlement partiel pris en compte par nos
            services d’un montant de ${formatPrice(totalPaye)},
            un solde de ${formatPrice(reste)} reste dû concernant cette facture,
            d’un montant total de ${formatPrice(facture.montant)}.
          </p>
        `;
      }

    // Calule échéance de la facture
    const dateFacture =
    new Date(relance.facture.date_facture);

    const dateEcheance =
    new Date(dateFacture);

    dateEcheance.setDate(
    dateEcheance.getDate() + 30
    );

    // Calcule des pénalité
    const totalAvecPenalites =
    reste + Number(relance.penalites || 0);

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

    const css = fs.readFileSync("./templates/asset/css/Relance.css", "utf8");
    html = `
    <style>${css}</style>
    ${html}
    `;
    
    const logoPath = path.join(__dirname, "../templates/asset/img/logo.png");
    const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });

    // Remplacer les variables
    html = html
      .replace("{{logo}}",logoBase64)
      .replaceAll("{{client_nom}}", facture.client?.nom || "")
      .replaceAll("{{client_tel}}", facture.client?.tel || "")
      .replaceAll("{{client_adresse}}", facture.client?.adresse || "")
      .replaceAll("{{client_code_postal}}", facture.client?.code_postal || "")
      .replaceAll("{{client_ville}}", facture.client?.ville || "")
      .replaceAll("{{date}}", formatDate(relance.date_relance))
      .replaceAll("{{date_echeance}}", formatDate(dateEcheance))
      .replaceAll("{{numero_facture}}", facture.numero || "")
      .replaceAll("{{date_facture}}", formatDate(facture.date_facture))
      .replaceAll("{{montant_facture}}", formatPrice(facture.montant))
      .replaceAll("{{date_relance_1}}",formatDate(relance1?.date_relance))
      .replaceAll("{{date_relance_2}}",formatDate(relance2?.date_relance))
      .replaceAll("{{date_relance_3}}",formatDate(relance3?.date_relance))
      .replaceAll("{{penalite}}", formatPrice(relance.penalites))
      .replaceAll("{{ar}}", relance.numero_ar || "")
      .replaceAll("{{delai_avant_poursuite}}", relance.delai_avant_poursuite || "")
      .replaceAll("{{reste_du}}", formatPrice(reste))
      .replaceAll("{{total_avec_penalites}}",formatPrice(totalAvecPenalites))
      .replaceAll("{{paiement_partiel}}", paiementPartielTexte)
      .replaceAll("{{paiement_partiel_demeure}}", paiementPartielTexteDemeure);

    // PDF
    console.log(chromium);
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true
    });
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
    res.status(500).json({ error: error.message });
  }
};