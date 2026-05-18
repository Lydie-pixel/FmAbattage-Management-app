// Charger les clients
fetch("http://localhost:3000/api/client")
  .then(res => res.json())
  .then(data => {

    const select =
      document.getElementById("client");

    // si le champ n'existe pas → stop
    if (!select) return;

    data.forEach(c => {

      select.innerHTML += `
        <option value="${c.id}">
          ${c.nom}
        </option>
      `;

    });

  });

// Met à jour les totaux à chaque changement de quantité ou de prix
function updateTotals() {
  let totalGlobal = 0;

  document.querySelectorAll(".item").forEach(item => {
    const qty = parseFloat(item.querySelector(".qty").value) || 0;
    const price = parseFloat(item.querySelector(".price").value) || 0;
    const total = qty * price;
    item.querySelector(".totalLigne").value = total.toFixed(2) + " €";
    totalGlobal += total;
  });

  const frais = parseFloat(document.getElementById("frais").value) || 0;
  totalGlobal += frais;
  document.getElementById("totalGlobal").innerText = totalGlobal.toFixed(2) + " €";
}

// Ajouter une ligne d'item
function addItem() {
  const container = document.getElementById("items");

  const newItem = document.createElement("div");
  newItem.className = "item row mb-2";

  newItem.innerHTML = `
    <div class="col">
      <input placeholder="Description" class="form-control desc">
    </div>
    <div class="col">
      <input type="number" placeholder="Qté" class="form-control qty" oninput="updateTotals()">
    </div>
    <div class="col">
      <input type="number" placeholder="Prix" class="form-control price" oninput="updateTotals()">
    </div>
    <div class="col">
      <input type="text" class="form-control totalLigne" disabled>
    </div>
    <div class="col-auto">
      <button class="btn btn-danger" onclick="this.closest('.item').remove(); updateTotals()">❌</button>
    </div>
  `;

  container.appendChild(newItem);
}