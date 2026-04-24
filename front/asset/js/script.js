fetch("http://localhost:3000/api/client")
  .then(response => response.json())
  .then(data => {
    console.log(data); // pour vérifier

    const div = document.getElementById("resultat");

    div.innerHTML = JSON.stringify(data);
  })
  .catch(error => console.error(error));