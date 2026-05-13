const container = document.getElementById("container");

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

const poolData = {
    UserPoolId: "us-east-2_eFOttIH6k",
    ClientId: "6opqk949b9qfq17d262acim8hu"
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

registerBtn.addEventListener("click", () => {
    container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
});

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    const attributeList = [];

    const emailAttribute = new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: "email",
        Value: email
    });

    const nameAttribute = new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: "name",
        Value: name
    });

    attributeList.push(emailAttribute);
    attributeList.push(nameAttribute);

    userPool.signUp(email, password, attributeList, null, function (err, result) {
        if (err) {
            console.error(err);
            alert(err.message || JSON.stringify(err));
            return;
        }

        console.log("Registro exitoso:", result);

        alert("Registro exitoso. Revisa tu correo para confirmar.");
    });
});

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: email,
        Password: password
    });

    const userData = {
        Username: email,
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            const idToken = result.getIdToken().getJwtToken();
            const accessToken = result.getAccessToken().getJwtToken();

            const payload = result.getIdToken().decodePayload();

            localStorage.setItem("idToken", idToken);
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("userSub", payload.sub);

            console.log("SUB:", payload.sub);

            alert("Login exitoso entrenador ⚡");
        },

        onFailure: function (err) {
            console.error(err);
            alert(err.message || JSON.stringify(err));
        }
    });
});
