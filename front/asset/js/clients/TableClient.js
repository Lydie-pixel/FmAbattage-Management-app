fetch("http://localhost:3000/api/client")
  .then(response => response.json())
  .then(data => {
    const div = document.getElementById("resultat");

    let html = `
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Téléphone</th>
            <th>Email</th>
            <th>Adresse</th>
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
          <td>
            <button class="btn btn-sm btn-primary">Voir</button>
            <button class="btn btn-sm btn-secondary">Modifier</button>
            <button class="btn btn-sm btn-danger">Supprimer</button>
         </td>
        </tr>
      `;
    });

    html += `</tbody></table>`;

    div.innerHTML = html;
  })
  .catch(error => console.error(error));