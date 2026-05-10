const params = new URLSearchParams(window.location.search);
const clientId = params.get("id");

function formatDateFR(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  const jour = String(date.getDate()).padStart(2, "0");
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const annee = date.getFullYear();

  return `${jour}/${mois}/${annee}`;
}

fetch(`http://localhost:3000/api/client/${clientId}`)
  .then(res => res.json())
  .then(client => {

    const div = document.getElementById("clientInfo");

    div.innerHTML = `
      <div>
        <h4>${client.nom}</h4>
        <span><strong>Téléphone :</strong> ${client.tel || "-"}</span><br>
        <span><strong>Email :</strong> ${client.email}</span><br>
        <span><strong>Adresse :</strong> ${client.adresse || "-"}</span><br>
        <span><strong>Ville :</strong> ${client.ville || "-"}</span><br>
        <span><strong>Code postal :</strong> ${client.code_postal || "-"}</span>
      </div>
    `;
  });

  fetch("http://localhost:3000/api/devis")
  .then(res => res.json())
  .then(data => {

    const devis = data.filter(d => d.client_id == clientId);
    const container = document.getElementById("clientDevis");

    let html = `
      <table class="table">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Montant</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
    `;

    devis.forEach(d => {
      html += `
        <tr>
          <td>${d.numero}</td>
          <td>${d.montant} €</td>
          <td>${d.statut}</td>
        </tr>
      `;
    });

    html += `</tbody></table>`;

    container.innerHTML = html;
  });

  fetch("http://localhost:3000/api/facture")
  .then(res => res.json())
  .then(data => {

    const factures = data.filter(f => f.client_id == clientId);
    const container = document.getElementById("clientFactures");

    let html = `
      <table class="table">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Montant</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
    `;

    factures.forEach(f => {
      html += `
        <tr>
          <td>${f.numero}</td>
          <td>${f.montant} €</td>
          <td>${f.statut}</td>
        </tr>
      `;
    });

    html += `</tbody></table>`;

    container.innerHTML = html;
  });

  fetch("http://localhost:3000/api/paiement")
  .then(res => res.json())
  .then(data => {

    const container = document.getElementById("clientPaiements");

    
    const paiements = data.filter(p => {
      return p.facture?.client_id == clientId;
    });

    let html = `
      <table class="table">
        <thead>
          <tr>
            <th>Facture</th>
            <th>Montant</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
    `;

    paiements.forEach(p => {
      html += `
        <tr>
          <td>${p.facture?.numero || "-"}</td>
          <td>${p.montant} €</td>
          <td>${formatDateFR(p.date_paiement)}</td>
        </tr>
      `;
    });

    html += `</tbody></table>`;

    container.innerHTML = html;
  });
