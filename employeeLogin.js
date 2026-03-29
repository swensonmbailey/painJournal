
// 1. Get a reference to the form element
const form = document.getElementById('login');
const alert = document.getElementById("alert");
const loadingSpinner = document.getElementById('loading-spinner');
const container = document.getElementById('container');


// 2. Add an event listener for the 'submit' event
form.addEventListener('submit', function (event) {
    // 3. Call preventDefault() to stop the form from submitting and refreshing the page
    event.preventDefault();

    logIn();


        
});


async function logIn(){

    loadingSpinner.style.display = 'block';
    container.style.display = 'none';

    let phone = document.getElementById("phone").value;
    let code = document.getElementById("code").value;
    let user = document.getElementById("username").value;


    const scrubbedPhone = phone.replace(/\D/g, '');
    const scrubbedCode = code.replace(/\D/g, '');

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "phone": scrubbedPhone,
    "projectNum": scrubbedCode,
    "username": user
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("http://127.0.0.1:3000/employee", requestOptions)
    .then(async response => {
        const status = response.status;
        const ok = response.ok;
        const body = await response.text();
        console.log("Status:", status);
        console.log("OK?:", ok);
        console.log("Body:", body);

        if (!ok) {


            loadingSpinner.style.display = 'none';
            container.style.display = 'block';

            // handle errors based on status
            if (status === 401) {
                console.log("credentials not valid");
                alert.innerText = "Alert: Either User didn't sign up for Pain Journal or Invalid credentials.";
                alert.classList.remove("hidden");
            } else if (status === 404) {
                console.log("Client/Project not found");
            } else if (status === 403) {
                console.log("Invalid credentials");
            }
            return 
        }

        const data = JSON.parse(body)
        sessionStorage.setItem("jwt", data.accessToken);


        window.location.replace("http://127.0.0.1:5500/employeeDashboard.html");
        
    })
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

