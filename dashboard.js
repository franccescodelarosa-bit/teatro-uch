const token = localStorage.getItem("idToken");
const userSub = localStorage.getItem("userSub");

if (!token || !userSub) {
    alert("Acceso denegado.");
    window.location.href = "index.html";
}
