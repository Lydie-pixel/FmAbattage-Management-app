import {
    formatDateFR,
    formatPrice,
    formatNiveau,
    formatStatut
} from "../helpers/format.js";


let editingId = null;

// Changement de statut
document.addEventListener("change", async (e) => {
    if (!e.target.classList.contains("statut-select")) {
        return;
    }

    const id = e.target.dataset.id;
    const statut = e.target.value;

    try {
        const res = await fetch(`/api/relance/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ statut })
        });

        if (!res.ok) {
            throw new Error("Erreur modification statut");
        }

        alert("Statut mis à jour");
    } catch (error) {
        console.error(error);
        alert(error.message);
    }

});

//Voir la page relance
function viewRelance(id) {
    window.location.href =
        `/pages/relanceVoir.html?id=${id}`;
}

window.viewRelance = viewRelance;

//Tableau
function relance() {

  fetch("/api/relance")

    .then(res => res.json())
    .then(data => {
      const container =
        document.getElementById("tableRelance");

      let html = `
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Niveau</th>
              <th>Client</th>
              <th>Facture</th>
              <th>Date</th>
              <th>Montant initial</th>
              <th>Montant restant</th>
              <th>Pénalités</th>
              <th>Numéro AR</th>
              <th>Commentaire</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
      `;

      data.forEach(relance => {

        // total payé
        let totalPaye = 0;

        relance.facture?.paiements?.forEach(p => {
          totalPaye += Number(p.montant);
        });

        // reste à payer
        const reste =
          Number(relance.facture?.montant || 0)
          - totalPaye;

        html += `
          <tr>
            <td>${formatNiveau(relance.niveau)}</td>

            <td>
              ${relance.facture?.client?.nom || "-"}
            </td>

            <td>
              ${relance.facture?.numero || "-"}
            </td>

            <td>
              ${formatDateFR(relance.date_relance || "-")}
            </td>

            <td>
              ${relance.facture?.montant || 0} €
            </td>

            <td>
              ${formatPrice(reste)}
            </td>

            <td>
              ${formatPrice(relance.penalites || 0)}
            </td>

            <td>
              ${relance.numero_ar || "-"}
            </td>

            <td>
              ${relance.commentaire || "-"}
            </td>

            <td>
              <select class="form-select statut-select"
                  data-id="${relance.id}">
                    
                <option value="envoyee"
                    ${formatStatut(relance.statut === "envoyee" ? "selected" : "")}>
                    Envoyée
                </option>

                <option value="payee"
                    ${formatStatut(relance.statut === "payee" ? "selected" : "")}>
                    Payée
                </option>

                <option value="procedure"
                    ${formatStatut(relance.statut === "procedure" ? "selected" : "")}>
                    En procédure
                </option>

                <option value="annulee"
                    ${formatStatut(relance.statut === "annulee" ? "selected" : "")}>
                    Annulée
                </option>
            </select>
            </td>

            <td>
                <button
                    class="btn btn-sm btn-secondary"
                    onclick="viewRelance(${relance.id})">
                    Voir
                </button>
                <button
                    class="btn btn-sm btn-outline-danger"
                    onclick="generateRelancePDF(${relance.id})">

                    <i class="bi bi-file-earmark-pdf"></i>
                    PDF
                </button>
            </td>
          </tr>
        `;

      });

      html += `
          </tbody>
        </table>
      `;

      container.innerHTML = html;

    })

    .catch(error => {
      console.error(error);
    });
}

window.onload = () => {
  relance();
};

//Ouvrir PDF
function openPDF(id) {
  window.open(`/api/relance/pdf/${id}`, "_blank");
}

function generateRelancePDF(id) {
    window.open(
        `/api/pdf/relance/${id}`,
        "_blank"
    );
}

window.generateRelancePDF =
    generateRelancePDF;