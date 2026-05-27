document
    .getElementById("loginForm")
    .addEventListener("submit", login);

async function login(e) {

    e.preventDefault();

    const mail =
        document.getElementById("mail").value;

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
                mail,
                password
            })
        }
    );

    if (res.ok) {

        window.location.href =
            "/";

    } else {

        alert("Identifiants invalides");

    }
}