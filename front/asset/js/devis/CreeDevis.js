//Chargement des dates
window.addEventListener("DOMContentLoaded", () => {
  const today = new Date();

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  // date devis = aujourd'hui
  document.getElementById("date_devis").value = formatDate(today);

  // échéance = +14 jours
  const echeance = new Date();
  echeance.setDate(today.getDate() + 14);

  document.getElementById("date_echeance").value = formatDate(echeance);
});

//Charger les clients
fetch("http://localhost:3000/api/client")
  .then(res => res.json())
  .then(data => {
    const select = document.getElementById("client");

    data.forEach(c => {
      select.innerHTML += `<option value="${c.id}">${c.nom}</option>`;
    });
  });


// Ajout d'un item
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

// Mise à jour des totaux
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

//Envoi du formulaire
document.getElementById("devisForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const client_id = document.getElementById("client").value;
  const date_devis = document.getElementById("date_devis").value;
  const date_echeance = document.getElementById("date_echeance").value;
  const frais = document.getElementById("frais").value;

  // récupérer les items
  const items = [];
  document.querySelectorAll(".item").forEach(el => {
    items.push({
      description: el.querySelector(".desc").value,
      quantite: el.querySelector(".qty").value,
      prix_unitaire: el.querySelector(".price").value
    });
  });

  fetch("http://localhost:3000/api/devis", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id,
      date_devis,
      date_echeance,
      frais_deplacement: frais,
      items
    })
  })
  .then(res => res.json())
  .then(() => {
    alert("Devis créé avec succès");
    window.location.href = "/pages/devis.html";
  });
});

//Générer PDF
function generatePDF() {
  const devisId = prompt("ID du devis à générer");

  fetch(`http://localhost:3000/api/pdf/devis/${devisId}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);

      if (data.url) {
        window.open(data.url, "_blank"); // 🔥 ouvre le PDF
      } else {
        alert("Erreur génération PDF");
      }
    })
    .catch(err => console.error(err));
}