const params = new URLSearchParams(window.location.search);
const devisId = params.get("id");

// Récupérer les données du devis
fetch(`http://localhost:3000/api/devis/${devisId}`)
  .then(res => res.json())
  .then(data => {
    remplirFormulaire(data);
  });

  // Remplir le formulaire avec les données du devis
  function remplirFormulaire(devis) {
  document.getElementById("client").value = devis.client_id;
  document.getElementById("date_devis").value = devis.date_devis;
  document.getElementById("date_echeance").value = devis.date_echeance;
  document.getElementById("frais").value = devis.frais_deplacement;

  const container = document.getElementById("items");
  container.innerHTML = "";

  devis.items.forEach(item => {
    const div = document.createElement("div");
    div.className = "item row mb-2";

    div.innerHTML = `
      <div class="col">
        <input value="${item.description}" class="form-control desc">
      </div>
      <div class="col">
        <input type="number" value="${item.quantite}" class="form-control qty" oninput="updateTotals()">
      </div>
      <div class="col">
        <input type="number" value="${item.prix_unitaire}" class="form-control price" oninput="updateTotals()">
      </div>
      <div class="col">
        <input type="text" class="form-control totalLigne" disabled>
      </div>
      <div class="col-auto">
        <button class="btn btn-danger" onclick="this.closest('.item').remove(); updateTotals()">❌</button>
      </div>
    `;

    container.appendChild(div);
  });

  updateTotals();
}

// Modification du devis
document.getElementById("devisForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const items = [];

  document.querySelectorAll(".item").forEach(el => {
    items.push({
      description: el.querySelector(".desc").value,
      quantite: el.querySelector(".qty").value,
      prix_unitaire: el.querySelector(".price").value
    });
  });

  fetch(`http://localhost:3000/api/devis/${devisId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: document.getElementById("client").value,
      date_devis: document.getElementById("date_devis").value,
      date_echeance: document.getElementById("date_echeance").value,
      frais_deplacement: document.getElementById("frais").value,
      items
    })
  })
  .then(res => res.json())
  .then(() => {
    alert("Devis modifié ✨");
    window.location.href = "/pages/devis.html";
  })
  .catch(err => console.error(err));
});