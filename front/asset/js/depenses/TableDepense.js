function loadStats() {
  const year = document.getElementById("year").value;
  const month = document.getElementById("month").value;

  let url = "";

  if (month) {
    url = `/api/facture/stats/${year}/${month}`;
  } else {
    url = `/api/facture/stats/year/${year}`;
  }

  function formatPrice(value) {
    return Number(value).toLocaleString("fr-FR") + " €";
  }

  fetch(url)
    .then(res => res.json())
    .then(data => {
      document.getElementById("total").innerText = formatPrice(data.total);
      document.getElementById("paye").innerText = formatPrice(data.paye);
      document.getElementById("nb").innerText = data.nb_factures;
    })
    .catch(error => {
      console.error("Erreur lors du chargement des statistiques :", error);
    });
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
  loadStats();
  loadDepenses();
};

// Table des dépenses
function loadDepenses() {
  fetch("/api/depense")
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById("depenseTable");
      table.innerHTML = "";

      data.forEach(d => {
        table.innerHTML += `
          <tr>
            <td>${new Date(d.date).toLocaleDateString()}</td>
            <td>${d.type}</td>
            <td>${d.description || ""}</td>
            <td>${Number(d.montant).toFixed(2)} €</td>
            <td>
              <button class="btn btn-danger btn-sm" onclick="deleteDepense(${d.id})">
                Supprimer
              </button>
            </td>
          </tr>
        `;
      });
    });
}

//Ajouter une dépense
function addDepense() {
  const data = {
    date: document.getElementById("date").value,
    type: document.getElementById("type").value,
    description: document.getElementById("description").value,
    montant: document.getElementById("montant").value
  };

  fetch("/api/depense", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(() => {
    loadDepenses();
    bootstrap.Modal.getInstance(document.getElementById('depenseModal')).hide();
  })
  .then(() => {
  loadDepenses();
  document.getElementById("date").value = "";
  document.getElementById("description").value = "";
  document.getElementById("montant").value = "";
})
}

// Supprimer une dépense
function deleteDepense(id) {
  if (!confirm("Supprimer cette dépense ?")) return;

  fetch(`/api/depense/${id}`, {
    method: "DELETE"
  })
  .then(() => loadDepenses());
}