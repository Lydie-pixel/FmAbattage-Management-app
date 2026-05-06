function formatType(type) {
  switch (type) {
    case "frais_carburant": return "Carburant";
    case "frais_materiel": return "Matériel";
    case "charges": return "Charges";
    case "autre": return "Autre";
    default: return type;
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
};

function reloadAll() {
  loadStats();
  loadDepensesByType();
  loadDepenses();
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

      let html = `<div class="d-flex gap-3 flex-wrap">`;

      data.forEach(d => {
        html += `
          <div class="card p-3 shadow-sm" style="min-width:150px;">
            <h6>${formatType(d.type)}</h6>
            <strong>${Number(d.total).toFixed(2)} €</strong>
          </div>
        `;
      });

      html += `</div>`;
      div.innerHTML = html;
    });
}