fetch("http://localhost:3000/api/facture")
  .then(res => res.json())
  .then(data => {

    const container = document.getElementById("paiements");

    const factures = data.filter(f =>
      f.statut === "en_attente" || f.statut === "partielle"
    );
    console.log(data);
    console.log(factures);

      let html = `
  <h3>Paiements à recevoir</h3>
  <table class="table table-striped">
    <thead>
      <tr>
        <th>Numéro</th>
        <th>Client</th>
        <th>Téléphone</th>
        <th>Montant</th>
        <th>Statut</th>
      </tr>
    </thead>
    <tbody>
`;

factures.forEach(f => {

  let badge = "bg-warning";
  if (f.statut === "partielle") badge = "bg-info";

  html += `
    <tr>
      <td>${f.numero}</td>
      <td>${f.client?.nom || "-"}</td>
      <td>${f.client?.tel || "-"}</td>
      <td>${f.montant} €</td>
      <td><span class="badge ${badge}">${f.statut}</span></td>
    </tr>
  `;
});

    html += `</tbody></table>`;

    container.innerHTML = html;
  });
