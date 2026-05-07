function loadDevisAccueil() {
  fetch("http://localhost:3000/api/devis/accueil")
    .then(res => res.json())
    .then(data => {

      const container = document.getElementById("devis");

      if (!container) {
        console.error("Div #devis introuvable");
        return;
      }

      console.log("DATA:", data);

      const today = new Date();

      const devisProches = data.filter(d => {
        const echeance = new Date(d.date_echeance);
        const diff = (echeance - today) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      });

      if (devisProches.length === 0) {
        container.innerHTML = "<p>Aucun devis proche 👍</p>";
        return;
      }

      let html = `
      <h3>Devis proches échéance</h3>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Numéro du devis</th>
            <th>Client</th>
            <th>Téléphone</th>
            <th>Date échéance</th>
          </tr>
        </thead>
        <tbody>
    `;

    devisProches.forEach(d => {

      const echeance = new Date(d.date_echeance);
      const diff = (echeance - today) / (1000 * 60 * 60 * 24);

      html += `
        <tr>
          <td>${d.numero}</td>
          <td>${d.client?.nom || "-"}</td>
          <td>${d.client?.tel || "-"}</td>
          <td>${new Date(d.date_echeance).toLocaleDateString("fr-FR")}</td>
        </tr>
      `;
    });

    html += `</tbody></table>`;

    container.innerHTML = html;
    })
    .catch(err => console.error(err));
}

window.onload = () => {
  loadDevisAccueil();
};