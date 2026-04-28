fetch("http://localhost:3000/api/devis")
  .then(res => res.json())
  .then(data => {

    const container = document.getElementById("devis");

    const today = new Date();

    const devisProches = data.filter(d => {
      if (d.statut !== "en_attente") return false;

      const echeance = new Date(d.date_echeance);
      const diff = (echeance - today) / (1000 * 60 * 60 * 24);

      return diff <= 7;
    });

    let html = `
      <h3>Devis proches échéance</h3>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Numéro du devis</th>
            <th>Client</th>
            <th>Téléphone</th>
            <th>Date échéance</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
    `;

    devisProches.forEach(d => {

      const echeance = new Date(d.date_echeance);
      const diff = (echeance - today) / (1000 * 60 * 60 * 24);
      const statutLabels = {
        en_attente: "En attente ⏳",
        accepte: "Accepté ✅",
        refuse: "Refusé ❌",
        archive: "Archivé 📦"
      };

      let badge = "bg-success";
      if (diff < 3) badge = "bg-danger";
      else if (diff < 7) badge = "bg-warning";

      html += `
        <tr>
          <td>${d.numero}</td>
          <td>${d.client?.nom || "-"}</td>
          <td>${d.client?.tel || "-"}</td>
          <td>${d.date_echeance}</td>
          <td><span class="badge ${badge}">${statutLabels[d.statut] || d.statut}</span></td>
        </tr>
      `;
    });

    html += `</tbody></table>`;

    container.innerHTML = html;
  });