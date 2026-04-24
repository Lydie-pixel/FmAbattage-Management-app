// Affiche la liste des clients
fetch("http://localhost:3000/api/client")
  .then(res => res.json())
  .then(clients => {
    const container = document.getElementById("clients");

    clients.forEach(client => {
      const div = document.createElement("div");
      div.innerHTML = `
        <h3>${client.nom}</h3>
        <p>${client.email}</p>
      `;
      container.appendChild(div);
    });
  });

  