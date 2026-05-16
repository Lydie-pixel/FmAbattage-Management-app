// Charger les factures
function loadFactures() {

  fetch("/api/facture")
    .then(res => res.json())
    .then(data => {

      const select =
        document.getElementById("facture_id");

      // uniquement impayées
      const factures = data.filter(f =>
        f.statut !== "payee"
      );

      factures.forEach(f => {

        select.innerHTML += `
          <option value="${f.id}">
            ${f.numero}
          </option>
        `;
      });
    });
}

//Afficher les infos réccupérer
document
  .getElementById("facture_id")
  .addEventListener("change", loadFactureInfos);

  function loadFactureInfos() {
  const id =
    document.getElementById("facture_id").value;
  if (!id) return;

  fetch(`/api/facture/${id}`)

    .then(res => res.json())
    .then(facture => {

      // total payé
      let totalPaye = 0;

      facture.paiements?.forEach(p => {
        totalPaye += Number(p.montant);
      });
      const reste =
        Number(facture.montant) - totalPaye;

      // affichage infos
      document.getElementById("factureInfos")
        .innerHTML = `

        <div class="card p-3 mb-3">

          <h5>Informations facture</h5>

          <p>
            <strong>Facture :</strong>
            ${facture.numero}
          </p>

          <p>
            <strong>Client :</strong>
            ${facture.client?.nom}
          </p>

          <p>
            <strong>Montant :</strong>
            ${facture.montant} €
          </p>

          <p>
            <strong>Déjà payé :</strong>
            ${totalPaye} €
          </p>

          <p>
            <strong>Reste dû :</strong>
            ${reste} €
          </p>

        </div>
      `;
    });
    // historique relances
fetch("/api/relance")
  .then(res => res.json())
  .then(relances => {

    // filtrer uniquement les relances
    // de cette facture
    const historique = relances.filter(r =>
      r.facture_id == id
    );

    let htmlHistorique = `
      <div class="card p-3 mb-3">
        <h5>Historique des relances</h5>
    `;

    if (historique.length === 0) {

      htmlHistorique += `
        <p>Aucune relance pour cette facture</p>
      `;

    } else {

      htmlHistorique += `
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Niveau</th>
              <th>Date</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
      `;

      historique.forEach(r => {

        htmlHistorique += `
          <tr>
            <td>${r.niveau}</td>
            <td>${r.date_relance}</td>
            <td>${r.statut}</td>
          </tr>
        `;

      });

      htmlHistorique += `
          </tbody>
        </table>
      `;
    }

    htmlHistorique += `</div>`;

    document.getElementById(
      "historiqueRelances"
    ).innerHTML = htmlHistorique;

  });
}

//Afficher/Masquer les champs mise en demeure
document
  .getElementById("niveau")
  .addEventListener("change", toggleMiseEnDemeure);

function toggleMiseEnDemeure() {
  const niveau =
    document.getElementById("niveau").value;

  const bloc =
    document.getElementById("miseEnDemeureFields");
  if (niveau === "mise_en_demeure") {
    bloc.style.display = "block";
  } else {
    bloc.style.display = "none";
  }
}

//Envoi du formulaire
document
  .getElementById("relanceForm")
  .addEventListener("submit", createRelance);

function createRelance(e) {

  e.preventDefault();

  const data = {

    facture_id:
      document.getElementById("facture_id").value,
    niveau:
      document.getElementById("niveau").value,
    date_relance:
      document.getElementById("date_relance").value,
    statut:
      document.getElementById("statut").value,
    commentaire:
      document.getElementById("commentaire").value,
    penalites:
      document.getElementById("penalites").value,
    delai_avant_poursuite:
      document.getElementById("delai_avant_poursuite").value,
    numero_ar:
      document.getElementById("numero_ar").value

  };

  fetch("/api/relance", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(data)

  })

  .then(async res => {
        const result = await res.json();
        if (!res.ok) {
            throw new Error(result.error);
        }
        return result;
    })

  .then(result => {
    alert("Relance créée");
    console.log(result);
  })

    .catch(error => {
        alert(error.message);
        console.error(error);
    });
}

window.onload = () => {
  loadFactures();
  toggleMiseEnDemeure();
};