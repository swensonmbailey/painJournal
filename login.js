
// 1. Get a reference to the form element
const form = document.getElementById('login');

// 2. Add an event listener for the 'submit' event
form.addEventListener('submit', function (event) {
    // 3. Call preventDefault() to stop the form from submitting and refreshing the page
    event.preventDefault();

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
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
        
});

