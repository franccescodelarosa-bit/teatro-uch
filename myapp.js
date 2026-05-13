const { Amplify, Auth } = window.aws_amplify || window.Amplify;
const container = document.getElementById("container");

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

Amplify.configure({
    Auth: {
        region: "us-east-2",
        userPoolId: "us-east-2_eFOttIH6k",
        userPoolWebClientId: "6opqk949b9qfq17d262acim8hu",
        mandatorySignIn: false
    }
});

registerBtn.addEventListener("click", () => {
    container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
});

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    try {
        const response = await Auth.signUp({
            username: email,
            password: password,
            attributes: {
                email: email,
                name: name
            }
        });

        console.log("Usuario registrado:", response);

        alert("Registro exitoso. Revisa tu correo para confirmar tu cuenta.");

    } catch (error) {
        console.error("Error registro:", error);
        alert(error.message);
    }
});

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    try {
        const user = await Auth.signIn(email, password);

        console.log("Login exitoso:", user);

        const session = await Auth.currentSession();

        const idToken = session.getIdToken().getJwtToken();
        const accessToken = session.getAccessToken().getJwtToken();

        const payload = session.getIdToken().payload;

        localStorage.setItem("idToken", idToken);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userSub", payload.sub);

        console.log("SUB:", payload.sub);

        alert(`Bienvenido entrenador.\nSUB: ${payload.sub}`);

    } catch (error) {
        console.error("Error login:", error);
        alert(error.message);
    }
});
