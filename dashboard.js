const token = localStorage.getItem("idToken");
const userSub = localStorage.getItem("userSub");
const userName = localStorage.getItem("userName");
const userEmail = localStorage.getItem("userEmail");

if (!token || !userSub) {
    alert("Acceso denegado.");
    window.location.href = "index.html";
}

const firebaseConfig = {
    apiKey: "AIzaSyCynJecnB3V5E5mZkg0TkDkaCfmvkZXgAk",
    authDomain: "dimension-portal-bb235.firebaseapp.com",
    databaseURL: "https://dimension-portal-bb235-default-rtdb.firebaseio.com",
    projectId: "dimension-portal-bb235",
    storageBucket: "dimension-portal-bb235.firebasestorage.app",
    messagingSenderId: "892762879486",
    appId: "1:892762879486:web:e836a2a452233375607caf",
    measurementId: "G-397EX4988L"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

const usersRef = db.ref("poke-teatro/onlineUsers");
const currentUserRef = usersRef.child(userSub);

currentUserRef.set({
    name: userName || "Entrenador",
    email: userEmail || "sin correo",
    connectedAt: Date.now()
});

currentUserRef.onDisconnect().remove();

const usersList = document.getElementById("usersList");

usersRef.on("value", (snapshot) => {
    const users = snapshot.val();

    usersList.innerHTML = "";

    if (!users) {
        usersList.innerHTML = "Sin entrenadores conectados";
        return;
    }

    Object.values(users).forEach((user) => {
        const div = document.createElement("div");
        div.className = "user-item";

        div.innerHTML = `
            <div class="user-dot"></div>
            <div>
                <div class="user-name">${user.name}</div>
                <div class="user-email">${user.email}</div>
            </div>
        `;

        usersList.appendChild(div);
    });
});
