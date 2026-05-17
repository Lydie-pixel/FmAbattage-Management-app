// ===== FORMAT DATE =====
function formatDateFR(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
}

// ===== FORMAT PRIX =====
function formatPrice(value) {
    return Number(value || 0).toLocaleString(
        "fr-FR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ) + " €";
}

// ===== UX NIVEAU =====
function formatNiveau(niveau) {
    switch (niveau) {
        case "relance_1":
            return "Première relance";

        case "relance_2":
            return "Deuxième relance";

        case "relance_3":
            return "Troisième relance";

        case "mise_en_demeure":
            return "Mise en demeure";

        default:
            return niveau;
    }
}

// ===== CHARGER RELANCE =====
async function loadRelance() {

    // récupérer id URL
    const params = new URLSearchParams(
        window.location.search
    );
    const id = params.get("id");
    if (!id) {
        alert("Relance introuvable");
        return;
    }

    try {
        const res = await fetch(
            `/api/relance/${id}`
        );
        const relance = await res.json();
        console.log(relance);

        // ===== FACTURE =====
        document.getElementById(
            "factureNumero"
        ).textContent =
            relance.facture?.numero || "-";

        // ===== INFOS FACTURE =====
        let totalPaye = 0;

        relance.facture?.paiements?.forEach(p => {
            totalPaye += Number(p.montant);
        });
        const reste =
            Number(relance.facture?.montant || 0)
            - totalPaye;

        document.getElementById(
            "factureInfos"
        ).innerHTML = `

            <p>
                <strong>Client :</strong>
                ${relance.facture?.client?.nom || "-"}
            </p>

            <p>
                <strong>Montant :</strong>
                ${formatPrice(relance.facture?.montant)}
            </p>

            <p>
                <strong>Déjà payé :</strong>
                ${formatPrice(totalPaye)}
            </p>

            <p>
                <strong>Reste dû :</strong>
                ${formatPrice(reste)}
            </p>
        `;

        // ===== HISTORIQUE =====
        let historiqueHTML = "";
        relance.facture?.relances?.forEach(r => {
            historiqueHTML += `
                <p>
                    ${formatNiveau(r.niveau)}
                    -
                    ${formatDateFR(r.date_relance)}
                </p>
            `;
        });

        document.getElementById(
            "historiqueRelances"
        ).innerHTML =
            historiqueHTML ||
            "<p>Aucune relance</p>";

        // ===== CHAMPS =====
        document.getElementById(
            "niveau"
        ).textContent =
            formatNiveau(relance.niveau);

        document.getElementById(
            "date_relance"
        ).textContent =
            formatDateFR(relance.date_relance);

        document.getElementById(
            "penalites"
        ).textContent =
            formatPrice(relance.penalites);

        document.getElementById(
            "delai_avant_poursuite"
        ).textContent =
            relance.delai_avant_poursuite || "-";

        document.getElementById(
            "numero_ar"
        ).textContent =
            relance.numero_ar || "-";

        document.getElementById(
            "commentaire"
        ).textContent =
            relance.commentaire || "-";

        // ===== PDF =====
        document.getElementById(
            "pdfButton"
        ).addEventListener("click", () => {
            window.open(
                `/api/pdf/relance/${relance.id}`,
                "_blank"
            );
        });

        // ===== AFFICHER / MASQUER MISE EN DEMEURE =====
        const bloc =
            document.getElementById(
                "miseEnDemeureFields"
            );
        if (
            relance.niveau !== "mise_en_demeure"
        ) {
            bloc.style.display = "none";
        }

    } catch (error) {
        console.error(error);
        alert(
            "Erreur chargement relance"
        );
    }
}

// ===== INIT =====
window.onload = () => {

    loadRelance();

};