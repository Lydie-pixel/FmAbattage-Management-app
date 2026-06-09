//Modification d'un client
function openEditModal(id) {
  document.getElementById("modalTitle").innerText = "Modifier le client";

  fetch(`/api/client/${id}`)
    .then(response => response.json())
    .then(client => {
      document.getElementById("clientId").value = client.id;
      document.getElementById("nom").value = client.nom;
      document.getElementById("tel").value = client.tel;
      document.getElementById("email").value = client.email;
      document.getElementById("adresse").value = client.adresse;
      document.getElementById("ville").value = client.ville;
      document.getElementById("code_postal").value = client.code_postal;
      document.getElementById("commentaire").value = client.commentaire;
    });

  const modal = new bootstrap.Modal(document.getElementById("clientModal"));
  modal.show();
}

//Sauvegarde du client (création ou modification)
function saveClient() {
  const id = document.getElementById("clientId").value;

  const client = {
    nom: document.getElementById("nom").value,
    tel: document.getElementById("tel").value,
    email: document.getElementById("email").value,
    adresse: document.getElementById("adresse").value,
    ville: document.getElementById("ville").value,
    code_postal: document.getElementById("code_postal").value,
    commentaire: document.getElementById("commentaire").value
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
    location.reload();
  });
}

window.openCreateClientModal = openCreateClientModal;
window.saveClient = saveClient;