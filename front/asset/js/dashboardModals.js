//========= CLIENT =========
// Ouvrir la modale création client
function openCreateClientModal() {

  document.getElementById("clientId").value = "";
  document.getElementById("nom").value = "";
  document.getElementById("tel").value = "";
  document.getElementById("email").value = "";
  document.getElementById("adresse").value = "";
  document.getElementById("ville").value = "";
  document.getElementById("code_postal").value = "";

  const modal = new bootstrap.Modal(
    document.getElementById("clientModal")
  );

  modal.show();
}

// Sauvegarder client
function saveClient() {

  const id = document.getElementById("clientId").value;

  const client = {
    nom: document.getElementById("nom").value,
    tel: document.getElementById("tel").value,
    email: document.getElementById("email").value,
    adresse: document.getElementById("adresse").value,
    ville: document.getElementById("ville").value,
    code_postal: document.getElementById("code_postal").value
  };

  const url = id
    ? `/api/client/${id}`
    : `/api/client`;

  const method = id ? "PUT" : "POST";

  fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(client)
  })
  .then(() => {

    bootstrap.Modal
      .getInstance(document.getElementById("clientModal"))
      .hide();

    location.reload();
  });
}

window.openCreateClientModal = openCreateClientModal;
window.saveClient = saveClient;

// ========= PAIEMENT =========
// Ouvrir modale création paiement
function openCreatePaiementModal() {

  editingId = null;

  document.getElementById("paieForm").reset();

  const modal = new bootstrap.Modal(
    document.getElementById("paieModal")
  );

  modal.show();
}

// Sauvegarder paiement
function savePaiement() {

  const data = {
    facture_id: document.getElementById("facture_id").value,
    montant: document.getElementById("montant").value,
    date_paiement: document.getElementById("date_paiement").value,
    mode_paiement: document.getElementById("mode_paiement").value
  };

  const method = editingId ? "PUT" : "POST";

  const url = editingId
    ? `/api/paiement/${editingId}`
    : `/api/paiement`;

  fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(async res => {

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Erreur serveur");
    }

    return result;
  })
  .then(() => {

    editingId = null;

    loadPaie();

    bootstrap.Modal
      .getInstance(document.getElementById("paieModal"))
      .hide();

    document.getElementById("paieForm").reset();
  })
  .catch(error => {
    console.error(error);
    alert(error.message);
  });
}

window.openCreatePaiementModal = openCreatePaiementModal;
window.savePaiement = savePaiement;


// ========= DEPENSE =========
// Ouvrir modale dépense
function openCreateDepenseModal() {

  document.getElementById("date").value = "";
  document.getElementById("type").value = "";
  document.getElementById("description").value = "";
  document.getElementById("montant").value = "";

  const modal = new bootstrap.Modal(
    document.getElementById("depenseModal")
  );

  modal.show();
}

// Sauvegarder dépense
function saveDepense() {

  const data = {
    date: document.getElementById("date").value,
    type: document.getElementById("type").value,
    description: document.getElementById("description").value,
    montant: document.getElementById("montant").value
  };

  fetch("/api/depense", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(() => {

    loadDepenses();

    bootstrap.Modal
      .getInstance(document.getElementById("depenseModal"))
      .hide();

    document.getElementById("depenseForm").reset();
  });
}

window.openCreateDepenseModal = openCreateDepenseModal;
window.saveDepense = saveDepense;

// ========= FACTURE =========
// Ouvrir modale facture
function openCreateFactureModal() {

  fetch("/api/devis")
    .then(res => res.json())
    .then(devis => {

      const maintenant = new Date();

      const devisDisponibles = devis.filter(d => {

        if (d.statut !== "accepte") return false;

        const dateDevis = new Date(d.date_devis);

        const diffJours =
          (maintenant - dateDevis)
          / (1000 * 60 * 60 * 24);

        return diffJours <= 400;
      });

      const select =
        document.getElementById("devisSelect");

      select.innerHTML = "";

      devisDisponibles.forEach(d => {

        const nbFactures =
          d.factures?.length || 0;

        select.innerHTML += `
          <option value="${d.id}">
            ${d.numero}
            | ${d.client?.nom || "Sans client"}
            | ${d.montant} €
            | ${nbFactures} facture(s)
          </option>
        `;
      });

      const modal = new bootstrap.Modal(
        document.getElementById("factureModal")
      );

      modal.show();
    });
}

// Sauvegarder facture
function saveFacture() {

  const id =
    document.getElementById("devisSelect").value;

  const frais =
    document.getElementById("fraisFinal").value || 0;

  fetch(`/api/facture/from-devis/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      frais_deplacement_final: frais
    })
  })
  .then(async res => {

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Erreur création facture");
    }

    return data;
  })
  .then(data => {

    bootstrap.Modal
      .getInstance(document.getElementById("factureModal"))
      .hide();

    window.open(
      `/api/pdf/facture/${data.facture.id}`,
      "_blank"
    );

    facture();
  })
  .catch(err => {
    console.error(err);
    alert(err.message);
  });
}

window.openCreateFactureModal = openCreateFactureModal;
window.saveFacture = saveFacture;