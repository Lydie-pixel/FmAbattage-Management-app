import {
  showToast
} from "../helpers/format.js"

let allClients = [];

function loadClients() {

  fetch("/api/client")
    .then(response => response.json())
    .then(data => {

      allClients = data;

      afficherClients(allClients);
    })
    .catch(error => console.error(error));
}

function afficherClients(data) {

  const div = document.getElementById("clientsTable");

  data.sort((a, b) =>
    a.nom.localeCompare(b.nom)
  );

  let html = `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Téléphone</th>
          <th>Email</th>
          <th>Adresse</th>
          <th>Ville</th>
          <th>Code postal</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach(client => {

    html += `
      <tr>
        <td>${client.nom}</td>
        <td>${client.tel || "-"}</td>
        <td>${client.email}</td>
        <td>${client.adresse || "-"}</td>
        <td>${client.ville || "-"}</td>
        <td>${client.code_postal || "-"}</td>
        <td>
          <a 
            href="/pages/FicheClient.html?id=${client.id}" 
            class="btn btn-dark btn-sm">
            <i class="bi bi-person-vcard"></i> Voir
          </a>

          <button
            class="btn btn-sm btn-secondary"
            onclick="openEditModal(${client.id})">
            Modifier
          </button>

          <button
            class="btn btn-sm btn-danger"
            onclick="deleteClient(${client.id})">
            Supprimer
          </button>

          <button 
            class="btn btn-outline-success btn-sm" 
            onclick="printClientPDF(${client.id})">
            Fiche Client PDF
          </button>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;

  div.innerHTML = html;
}

// recherche
document
  .getElementById("searchClient")
  .addEventListener("input", e => {

    const recherche =
      e.target.value.toLowerCase();

    const filtres = allClients.filter(client =>
      client.nom.toLowerCase().includes(recherche)
    );

    afficherClients(filtres);
  });

loadClients();

// Suppression d'un client
function deleteClient(id) {
  if (!confirm("Supprimer ce client ?")) return;

  fetch(`/api/client/${id}`, {
    method: "DELETE"
  })
  .then(async res => {

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Erreur suppression");
    }
    return data;
  })
  .then(() => {
    showToast("Client supprimé", "success");

    loadClients();
  })
  .catch(err => {
    showToast(err.message, "danger");
  });
}

function printClientPDF(id) {
  const clientId = id || new URLSearchParams(window.location.search).get("id");

  if (!clientId) {
    console.error("Client ID introuvable");
    return;
  }

  window.open(`/api/pdf/client/${clientId}`, "_blank");
}

window.printClientPDF = printClientPDF;

window.deleteClient = deleteClient