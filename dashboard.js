const token = localStorage.getItem("idToken");
const userSub = localStorage.getItem("userSub");
const userName = localStorage.getItem("userName");
const userEmail = localStorage.getItem("userEmail");

if (!token || !userSub) {
    alert("Acceso denegado.");
    window.location.href = "index.html";
}

/* FIREBASE */
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
const rolesRef = db.ref("poke-teatro/roles/currentDJ");
const playerRef = db.ref("poke-teatro/player");

const usersList = document.getElementById("usersList");
const djPanel = document.getElementById("djPanel");
const playlistContainer = document.getElementById("playlistContainer");

/* PLAYLIST */
const playlist = [
    { title: "Pokémon Theme", videoId: "JuYeHPFR3f0" },
    { title: "Pokémon Johto", videoId: "2cT6ULpScZA" },
    { title: "Pokémon Battle Theme", videoId: "2Jmty_NiaXc" },
    { title: "Lavender Town", videoId: "JNJJ-QkZ8cM" },
    { title: "Pokémon Center", videoId: "4xjR8A9d0hU" }
];

/* YOUTUBE PLAYER */
let player;
let currentDJ = null;
let djCooldown = false;

window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player("youtubePlayer", {
        height: "100%",
        width: "100%",
        videoId: playlist[0].videoId,
        playerVars: {
            autoplay: 1,
            controls: 1,
            rel: 0
        },
        events: {
            onReady: (event) => {
                event.target.mute();
                event.target.playVideo();
            }
        }
    });
};

/* REGISTER ONLINE USER */
const currentUserRef = usersRef.child(userSub);

currentUserRef.set({
    name: userName || "Entrenador",
    email: userEmail || "sin correo",
    connectedAt: Date.now()
});

currentUserRef.onDisconnect().remove();

/* DJ PANEL */
function renderDJPanel() {
    playlistContainer.innerHTML = "";

    playlist.forEach(song => {
        const btn = document.createElement("button");
        btn.className = "song-btn";
        btn.textContent = song.title;

        btn.addEventListener("click", () => {
            if (currentDJ !== userSub) return;

            playerRef.set({
                currentVideo: song.videoId,
                changedBy: userSub,
                updatedAt: Date.now()
            });
        });

        playlistContainer.appendChild(btn);
    });
}

/* USERS LIST */
function renderUsers(users, djSub) {
    usersList.innerHTML = "";

    if (!users) {
        usersList.innerHTML = "Sin entrenadores conectados";
        return;
    }

    Object.entries(users).forEach(([sub, user]) => {
        const div = document.createElement("div");
        div.className = "user-item";

        const isDJ = djSub === sub;
        const isCurrentUser = sub === userSub;

        div.innerHTML = `
            <div class="user-header">
                <div class="user-dot"></div>
                <div>
                    <div class="user-name">${user.name}</div>
                    <div class="user-email">${user.email}</div>
                </div>
            </div>
        `;

        if (isDJ) {
            const badge = document.createElement("div");
            badge.className = "dj-badge";
            badge.textContent = "🎵 POKE DJ";
            div.appendChild(badge);
        }

        if (!isDJ) {
            const btn = document.createElement("button");
            btn.className = "dj-btn";
            btn.textContent = "SER POKE DJ";

            if (!isCurrentUser || djSub || djCooldown) {
                btn.disabled = true;
            }

            btn.addEventListener("click", () => {
                if (djCooldown) return;

                djCooldown = true;
                btn.disabled = true;

                rolesRef.set(userSub);

                setTimeout(() => {
                    djCooldown = false;
                }, 5000);
            });

            div.appendChild(btn);
        }

        usersList.appendChild(div);
    });
}

/* LISTEN USERS */
usersRef.on("value", (snapshot) => {
    usersRef.once("value", (usersSnap) => {
        rolesRef.once("value", (roleSnap) => {
            renderUsers(usersSnap.val(), roleSnap.val());
        });
    });
});

/* LISTEN DJ */
rolesRef.on("value", (snapshot) => {
    currentDJ = snapshot.val();

    if (currentDJ === userSub) {
        djPanel.classList.remove("hidden");
        renderDJPanel();
    } else {
        djPanel.classList.add("hidden");
    }

    usersRef.once("value", (usersSnap) => {
        renderUsers(usersSnap.val(), currentDJ);
    });
});

/* LISTEN PLAYER */
playerRef.on("value", (snapshot) => {
    const data = snapshot.val();

    if (!data || !player) return;

    if (data.currentVideo) {
        player.loadVideoById(data.currentVideo);
    }
});
