export async function checkAuth() {

    const res = await fetch("/api/auth/me");

    if (!res.ok) {
        window.location.href = "/pages/login.html";
        return false;
    }

    return true;
}