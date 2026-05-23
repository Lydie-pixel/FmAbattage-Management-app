const params = new URLSearchParams(window.location.search);
const clientId = params.get("id");

import {
    formatDateFR,
    formatPrice,
    formatMode,
    formatNiveau
} from "../helpers/format.js";

  // PDF
function generatePDF(id) {
  window.open(`/api/pdf/devis/${id}`, "_blank");
}
function generateFacturePDF(id) {
  window.open(`http://localhost:3000/api/pdf/facture/${id}`, "_blank");
}
function relancePDF(id){
  window.open(`http://localhost:3000/api/pdf/relance/${id}`, "_blank");
}

fetch(`http://localhost:3000/api/client/${clientId}`)
  .then(res => res.json())
  .then(client => {

    document.getElementById("clientTitle")
      .textContent = client.nom;

    const div = document.getElementById("clientInfo");

    div.innerHTML = `
      ...
    `;
});


fetch(`http://localhost:3000/api/client/${clientId}`)
  .then(res => res.json())
  .then(client => {

    const div = document.getElementById("clientInfo");

    div.innerHTML = `
      <div>
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
            <th>Date</th>
            <th>Montant</th>
            <th>Statut</th>
            <th>PDF</th>
          </tr>
        </thead>
        <tbody>
    `;

    devis.forEach(d => {
      html += `
        <tr>
          <td>${d.numero}</td>
          <td>${formatDateFR(d.date_devis)}</td>
          <td>${d.montant} €</td>
          <td>${d.statut}</td>
          <td>
            <button 
              type="button" 
              class="btn btn-outline-secondary btn-sm"
              onclick="generatePDF(${d.id})">
              <i class="bi bi-file-earmark-pdf"></i> PDF
            </button>
          </td>
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
            <th>Date</th>
            <th>Montant</th>
            <th>Statut</th>
            <th>PDF</th>
          </tr>
        </thead>
        <tbody>
    `;

    factures.forEach(f => {
      html += `
        <tr>
          <td>${f.numero}</td>
          <td>${formatDateFR(f.date_facture)}</td>
          <td>${f.montant} €</td>
          <td>${f.statut}</td>
          <td>
            <button 
              type="button" 
              class="btn btn-outline-secondary btn-sm"
              onclick="generateFacturePDF(${f.id})">
              <i class="bi bi-file-earmark-pdf"></i> PDF
            </button>
          </td>
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
            <th>Date</th>
            <th>Montant</th>
            <th>Mode de paiement</th>
          </tr>
        </thead>
        <tbody>
    `;

    paiements.forEach(p => {
      html += `
        <tr>
          <td>${p.facture?.numero || "-"}</td>
          <td>${formatDateFR(p.date_paiement)}</td>
          <td>${p.montant} €</td>
          <td>${formatMode(p.mode_paiement)}</td>
        </tr>
      `;
    });

    html += `</tbody></table>`;

    container.innerHTML = html;
  });


  fetch("http://localhost:3000/api/relance")
  .then(res => res.json())
  .then(data => {

    const container = document.getElementById("clientRelance");

    
    const relance = data.filter(r => {
      return r.facture?.client_id == clientId;
    });

    let html = `
      <table class="table">
        <thead>
          <tr>
            <th>Facture</th>
            <th>Niveau de relance</th>
            <th>Date de relance</th>
            <th>PDF</th>
          </tr>
        </thead>
        <tbody>
    `;

    relance.forEach(r => {
      html += `
        <tr>
          <td>${r.facture?.numero || "-"}</td>
          <td>${formatNiveau(r.niveau)}</td>
          <td>${formatDateFR(r.date_relance)}</td>
          <td>
            <button 
              type="button" 
              class="btn btn-outline-secondary btn-sm"
              onclick="relancePDF(${r.id})">
              <i class="bi bi-file-earmark-pdf"></i> PDF
            </button>
          </td>
        </tr>
      `;
    });

    html += `</tbody></table>`;

    container.innerHTML = html;
  });

  //Rendre les PDF ouvrable
  window.generateFacturePDF = generateFacturePDF;
  window.generatePDF = generatePDF;
  window.relancePDF = relancePDF;