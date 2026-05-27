// Vérification connexion

import { checkAuth } from "./helpers/auth.js";

await checkAuth();

// Affiche le header
fetch("/components/Header.html")
.then(res => res.text())
.then(data => {

    const header =
        document.getElementById("header");

    if (header) {

        header.innerHTML = data;

        const logoutBtn =
            document.getElementById("logoutBtn");

        if (logoutBtn) {

            logoutBtn.addEventListener(
                "click",
                async () => {

                    await fetch(
                        "/api/auth/logout",
                        {
                            method: "POST"
                        }
                    );

                    window.location.href =
                        "/pages/login.html";
                }
            );
        }
    }
});

// Affiche le footer
fetch("/components/Footer.html")
.then(res => res.text())
.then(data => {
    const footer = document.getElementById("footer");
    if(footer) footer.innerHTML = data;
});