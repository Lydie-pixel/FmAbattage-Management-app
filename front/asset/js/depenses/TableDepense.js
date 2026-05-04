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
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById("depenseTable");
      table.innerHTML = "";

      data.forEach(d => {
        table.innerHTML += `
          <tr>
            <td>${new Date(d.date).toLocaleDateString()}</td>
            <td>${formatType(d.type)}</td>
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