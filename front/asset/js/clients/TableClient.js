let allClients = [];

function loadClients() {

  fetch("http://localhost:3000/api/client")
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