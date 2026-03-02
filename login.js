
// 1. Get a reference to the form element
const form = document.getElementById('login');
const alert = document.getElementById("alert");

let isSignUp = false;

// 2. Add an event listener for the 'submit' event
form.addEventListener('submit', function (event) {
    // 3. Call preventDefault() to stop the form from submitting and refreshing the page
    event.preventDefault();

    if(isSignUp){
        signup();
    }else{
        logIn();
    }


        
});

const switchBox = document.getElementById("switchBox");

switchBox.addEventListener('click', function(){
    isSignUp = !isSignUp;

    alert.classList.add("hidden");

    let subtitle = "Login";
    let switchText = "Sign Up";

    if(isSignUp){
        subtitle = "Signup";
        switchText = "Log In";
    }
    document.getElementById("subtitle").innerText = subtitle;
    document.getElementById("submit").value = subtitle;
    switchBox.innerText = switchText;
});

document.addEventListener('DOMContentLoaded', function(){
    checkJWT();
});

async function checkJWT(){

    if (localStorage.getItem('jwt') == null) {
        console.log('in check jwt if');
        return
    }

    const jwt = localStorage.getItem('jwt');

    console.log(jwt);

    var myHeaders = new Headers();
    myHeaders.append("authorization", "Bearer " + jwt);

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
    };

    fetch("http://127.0.0.1:3000/client/JWTLogin", requestOptions)
    .then(async response => {
        const status = response.status;
        const ok = response.ok;
        const body = await response.text();
        console.log("Status:", status);
        console.log("OK?:", ok);
        console.log("Body:", body);

        if (!ok) {
            // handle errors based on status
            if (status === 401) {
                console.log("Already signed up");
                alert.innerText = "Alert: Already Signed Up. Please Log In.";
                alert.classList.remove("hidden");
            } else if (status === 404) {
                console.log("Client/Project not found");
            } else if (status === 403) {
                console.log("Invalid credentials");
            }
            return 
        }

        window.location.replace("http://127.0.0.1:5500/dashboard.html");
    })
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

async function logIn(){
    let phone = document.getElementById("phone").value;
    let code = document.getElementById("code").value;


    const scrubbedPhone = phone.replace(/\D/g, '');
    const scrubbedCode = code.replace(/\D/g, '');

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "phone": scrubbedPhone,
    "projectNum": scrubbedCode
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("http://127.0.0.1:3000/client/login", requestOptions)
    .then(async response => {
        const status = response.status;
        const ok = response.ok;
        const body = await response.text();
        console.log("Status:", status);
        console.log("OK?:", ok);
        console.log("Body:", body);

        if (!ok) {
            // handle errors based on status
            if (status === 401) {
                console.log("credentials not valid");
                alert.innerText = "Alert: Invalid credentials. Try signing up first or check credentials.";
                alert.classList.remove("hidden");
            } else if (status === 404) {
                console.log("Client/Project not found");
            } else if (status === 403) {
                console.log("Invalid credentials");
            }
            return 
        }

        const data = JSON.parse(body)
        localStorage.setItem("jwt", data.accessToken);


        window.location.replace("http://127.0.0.1:5500/dashboard.html");
        
    })
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

async function signup(){
    let phone = document.getElementById("phone").value;
    let code = document.getElementById("code").value;


    const scrubbedPhone = phone.replace(/\D/g, '');
    const scrubbedCode = code.replace(/\D/g, '');

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "phone": scrubbedPhone,
    "projectNum": scrubbedCode
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("http://127.0.0.1:3000/client/signup", requestOptions)
    .then(async response => {
        const status = response.status;
        const ok = response.ok;
        const body = await response.text();
        console.log("Status:", status);
        console.log("OK?:", ok);
        console.log("Body:", body);

        if (!ok) {
            // handle errors based on status
            if (status === 401) {
                console.log("Already signed up");
                alert.innerText = "Alert: Already Signed Up. Please Log In.";
                alert.classList.remove("hidden");
            } else if (status === 404) {
                console.log("Client/Project not found");
            } else if (status === 403) {
                console.log("Invalid credentials");
            }
            return 
        }

        const data = JSON.parse(body)
        localStorage.setItem("jwt", data.accessToken);

        window.location.replace("http://127.0.0.1:5500/dashboard.html");
    })
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}