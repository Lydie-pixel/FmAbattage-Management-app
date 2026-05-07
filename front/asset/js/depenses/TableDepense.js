function formatType(type) {
  switch (type) {
    case "frais_carburant": return "Carburant";
    case "frais_materiel": return "Matériel";
    case "charges": return "Charges";
    case "autre": return "Autre";
    default: return type;
  }
}

// Table des dépenses
function loadDepenses() {
  fetch("/api/depense")
    .then(res => {
      if (!res.ok) throw new Error("Erreur API");
      return res.json();
    })
    .then(data => {
      const selectedYear = document.getElementById("yearFilter").value;
      data = data.filter(d => {
        const year = new Date(d.date).getFullYear();
        return year == selectedYear;
      });
      const div = document.getElementById("depenseTable");
      let html=`
        <table class="table table-striped">
          <thead>
              <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th>Montant</th>
              <th>Action</th>
              </tr>
          </thead>
          <tbody>
          `;
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      data.forEach(d => {
        html += `
          <tr>
            <td>${new Date(d.date).toLocaleDateString()}</td>
            <td>${formatType(d.type)}</td>
            <td>${d.description || ""}</td>
            <td>${Number(d.montant).toFixed(2)} €</td>
            <td class="actions-cell">
              <button 
                class="btn btn-danger btn-sm" 
                onclick="deleteDepense(${d.id})">
                Supprimer
              </button>
            </td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
                  if (data.length === 0) {
          div.innerHTML = "<p>Aucune dépense pour le moment</p>";
          return;
        }
      div.innerHTML = html;
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

  document.getElementById("date").value = "";
  document.getElementById("description").value = "";
  document.getElementById("montant").value = "";
});
}

// Supprimer une dépense
function deleteDepense(id) {
  if (!confirm("Supprimer cette dépense ?")) return;

  fetch(`/api/depense/${id}`, {
    method: "DELETE"
  })
  .then(() => loadDepenses());
}

window.onload = () => {
  initYearFilter();
  loadDepenses();
};

// Trier par année
function initYearFilter() {
  const select = document.getElementById("yearFilter");
  const currentYear = new Date().getFullYear();

  for (let i = currentYear; i >= currentYear - 5; i--) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    select.appendChild(option);
  }

  select.value = currentYear;
}