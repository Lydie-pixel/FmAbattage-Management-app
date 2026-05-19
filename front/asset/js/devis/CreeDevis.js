
//Chargement des dates
window.addEventListener("DOMContentLoaded", () => {
  const today = new Date();

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  // date devis = aujourd'hui
  document.getElementById("date_devis").value = formatDate(today);

  // échéance = +15 jours
  const echeance = new Date();
  echeance.setDate(today.getDate() + 15);

  document.getElementById("date_echeance").value = formatDate(echeance);
});

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
  .then(data => {
    console.log("DATA :", data);

  const url = `http://localhost:3000/api/pdf/devis/${data.id}`;

  // ouvre le PDF
  window.open(url, "_blank");

  // redirige vers la liste
  window.location.href = "/pages/devis.html";
})
  .catch(err => {
    console.error("Erreur front :", err);
    alert("Erreur lors de la modélisation PDF du devis");
  })
});