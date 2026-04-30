//Facturer un devis
function facturer(id) {
  const frais = prompt("Frais de déplacement final ?");

  fetch(`http://localhost:3000/api/facture/from-devis/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      frais_deplacement_final: frais || 0
    })
  })
  .then(res => res.json())
  .then(() => {
    alert("Facture créée 🔥");
    location.reload();
  });
}

// Action sur un devis
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("btn-supprimer")) {

    const id = e.target.dataset.id;

    if (!confirm("Supprimer ce devis ?")) return;

    fetch(`http://localhost:3000/api/devis/${id}`, {
      method: "DELETE"
    })
    .then(res => res.json())
    .then(() => {
      alert("Devis supprimé");
      location.reload(); // refresh liste
    })
    .catch(err => console.error(err));
  }

  if (e.target.classList.contains("btn-modifier")) {
  const id = e.target.dataset.id;
  window.location.href = `/pages/ModifDevis.html?id=${id}`;
}
if (e.target.classList.contains("btn-facturer")) {
  const id = e.target.dataset.id;

  fetch(`http://localhost:3000/api/facture/${id}`, {
    method: "POST"
  })
  .then(res => res.json())
  .then(() => {
    alert("Facture créée");
    location.reload();
  })
  .catch(err => console.error(err));
}
});

//Changer de statut
function changeStatut(id, statut) {
  fetch(`http://localhost:3000/api/devis/${id}/statut`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ statut })
  })
  .then(() => {
    alerte("Statut mis à jour");
  });
}

//Générer PDF
function generatePDF(id) {
  window.open(`http://localhost:3000/api/pdf/devis/${id}`, "_blank");
}

fetch("http://localhost:3000/api/devis")
  .then(response => response.json())
  .then(data => {

    const container = document.getElementById("tableDevis");


    let html = `

      <table class="table table-striped">
        <thead>
          <tr>
            <th>Numéro du devis</th>
            <th>Client</th>
            <th>Téléphone</th>
            <th>Date échéance</th>
            <th>Montant</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        `;

    data.forEach(devis => {    
    const statutLabels = {
        en_attente: "En attente ",
        accepte: "Accepté ",
        refuse: "Refusé ",
        archive: "Archivé "
      };

      let factureBtn = "";

let actions = "";

// Bouton modifier seulement si PAS accepté
if (devis.statut !== "accepte") {
  actions += `<button class="btn btn-warning btn-modifier" data-id="${devis.id}">Modifier</button>`;
}

// Bouton facturer uniquement si accepté
if (devis.statut === "accepte") {
  actions += `<button class="btn btn-success btn-facturer" data-id="${devis.id}">Facturer</button>`;
}

// Toujours afficher supprimer (ou à adapter selon ton besoin)
actions += `<button class="btn btn-danger btn-supprimer" data-id="${devis.id}">Supprimer</button>`;

    html += `
      <tr>
        <td>${devis.numero}</td>
        <td>${devis.client?.nom || "-"}</td>
        <td>${devis.client?.tel || "-"}</td>
        <td>${devis.date_echeance}</td>
        <td>${devis.montant} €</td>
        <td>
          <select onchange="changeStatut(${devis.id}, this.value)" class="form-select form-select-sm">
            <option value="en_attente" ${devis.statut === "en_attente" ? "selected" : ""}>En attente</option>
            <option value="accepte" ${devis.statut === "accepte" ? "selected" : ""}>Accepté</option>
            <option value="refuse" ${devis.statut === "refuse" ? "selected" : ""}>Refusé</option>
            <option value="archive" ${devis.statut === "archive" ? "selected" : ""}>Archivé</option>
          </select>
        </td>
        <td>
          <button type="button" onclick="generatePDF(${devis.id})">📄 PDF</button>
          ${actions}
        </td>
      </tr>
    `;
  });

    html += `</tbody></table>`;

    container.innerHTML = html;
});

window.facturer = facturer;
window.changeStatut = changeStatut;
window.generatePDF = generatePDF;