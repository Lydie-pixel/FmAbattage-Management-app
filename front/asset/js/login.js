document
    .getElementById("loginForm")
    .addEventListener("submit", login);

async function login(e) {

    e.preventDefault();

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    const res = await fetch(
        "/api/auth/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        }
    );

    if (res.ok) {

        window.location.href =
            "/pages/Statistique.html";

    } else {

        alert("Identifiants invalides");

    }
}