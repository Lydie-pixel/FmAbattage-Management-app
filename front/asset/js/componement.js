// Affiche le header
fetch("./components/Header.html")
.then(res => res.text())
.then(data => {
    const header = document.getElementById("header");
    if(header) header.innerHTML = data;
});

// Affiche le footer
fetch("./components/Footer.html")
.then(res => res.text())
.then(data => {
    const footer = document.getElementById("footer");
    if(footer) footer.innerHTML = data;
});