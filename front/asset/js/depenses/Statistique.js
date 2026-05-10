function formatType(type) {
  switch (type) {
    case "frais_carburant": return "Carburant";
    case "frais_materiel": return "Matériel";
    case "charges": return "Charges";
    case "autre": return "Autre";
    default: return type;
  }
}

function getDepenseIcon(type) {

  switch(type){

    case "frais_carburant":
      return "bi-fuel-pump-fill";

    case "frais_materiel":
      return "bi-tools";

    case "charges":
      return "bi-bank";

    case "autre":
      return "bi-wallet2";

    default:
      return "bi-cash";
  }
}

function loadStats() {
  const year = document.getElementById("year").value;
  const month = document.getElementById("month").value;

  let url = month
    ? `/api/stats/month/${year}/${month}`
    : `/api/stats/year/${year}`;

  function formatPrice(value) {
    return Number(value || 0).toLocaleString("fr-FR") + " €";
  }

  fetch(url)
    .then(res => res.json())
    .then(data => {

      // 👉 CAS MENSUEL (simple)
      if (month) {
        updateUI(data);
      }

      // 👉 CAS ANNUEL (on additionne)
      else {
        let global = {
          ca: 0,
          paye: 0,
          enAttente: 0,
          depenses: 0
        };

        data.forEach(m => {
          global.ca += m.ca || 0;
          global.paye += m.paye || 0;
          global.enAttente += m.enAttente || 0;
          global.depenses += m.depenses || 0;
        });

        updateUI(global);
      }

    })
    .catch(error => {
      console.error("Erreur lors du chargement des statistiques :", error);
    });
}

function updateUI(data) {
  function formatPrice(value) {
    return Number(value || 0).toLocaleString("fr-FR") + " €";
  }

  const ca = data.ca || 0;
  const paye = data.paye || 0;
  const attente = data.enAttente || 0;
  const depenses = data.depenses || 0;
  const benef = ca - depenses;

  document.getElementById("ca").innerText = formatPrice(ca);
  document.getElementById("paye").innerText = formatPrice(paye);
  document.getElementById("attente").innerText = formatPrice(attente);
  document.getElementById("depenses").innerText = formatPrice(depenses);

  const benefEl = document.getElementById("benefice");
  benefEl.innerText = formatPrice(benef);

  // 🎨 couleur dynamique
  benefEl.style.color = benef >= 0 ? "green" : "red";
}


function initYearSelect() {
  const select = document.getElementById("year");
  const currentYear = new Date().getFullYear();

  for (let i = currentYear; i >= currentYear - 5; i--) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    select.appendChild(option);
  }

  // sélection automatique de l'année actuelle
  select.value = currentYear;
}

window.onload = () => {
  initYearSelect();
  reloadAll();
  paiement();
};

function reloadAll() {
  loadStats();
  loadDepensesByType();
  paiement();
}

function loadDepensesByType() {
  const year = document.getElementById("year").value;
  const month = document.getElementById("month").value;

  let url = `/api/depense/by-type?year=${year}`;

  if (month) {
    url += `&month=${month}`;
  }

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const div = document.getElementById("depenseByType");

      if (!data.length) {
        div.innerHTML = "<p>Aucune dépense sur cette période</p>";
        return;
      }

      let html = "";

      data.forEach(d => {
    html += `
    <div class="depense-card">
          <div class="stats-header">
            <h6>${formatType(d.type)}</h6>
            <i class="bi ${getDepenseIcon(d.type)}"></i>
          </div>
        <strong>${Number(d.total).toFixed(2)} €</strong>
    </div>
`;
});
      div.innerHTML = html;
    });
}

function paiement(){
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
  <table class="table table-striped">
    <thead>
      <tr>
        <th>Numéro de facture</th>
        <th>Client</th>
        <th>Montant</th>
        <th>Date de la facture</th>
      </tr>
    </thead>
    <tbody>
`;

factures.forEach(f => {
  
  html += `
    <tr>
      <td>${f.numero}</td>
      <td>${f.client?.nom || "-"}</td>
      <td>${f.montant} €</td>
      <th>${f.date_facture}</th>
    </tr>
  `;
});

    html += `</tbody></table>`;

    container.innerHTML = html;
  });
}
