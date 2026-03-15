

const clientName = document.getElementById("clientName");
const attorneyName = document.getElementById("attorneyName");
const caseStatus = document.getElementById("caseStatus");
const lastEntryBox = document.getElementById("lastEntryBox");
const lastEntryButton = document.getElementById("lastEntryButton");
const lastEntry = document.getElementById("lastEntry");
const lastEntryScale = document.getElementById("lastEntryScale");
const lastEntryText = document.getElementById("lastEntryText");
const lastEntryDate = document.getElementById("lastEntryDate");
const entryForm = document.getElementById("entryForm");
const entryTitle = document.getElementById("entryTitle");
const entryText = document.getElementById("entryText");
const painScale = document.getElementById("painScale");
const submitEntry = document.getElementById("submitEntry");
const signOut = document.getElementById("signOut");
const noLastEntry = document.getElementById("noLastEntry");
const lastEntryEdit = document.getElementById("lastEntryEdit");
const loadingSpinner = document.getElementById("loading-spinner");
const container = document.getElementById("container");

const lastEntryId = null;

let showLast = false;
let editLast = false;

let clientInfo;

document.addEventListener('DOMContentLoaded', async function(){
    clientData = await checkJWT();

    clientName.innerText = `${clientData[0].firstName} ${clientData[0].lastName}`;
    attorneyName.innerText = `${clientData[0].attorneyName}`;
    caseStatus.innerText = `${clientData[0].phaseName}`;

});

async function checkJWT() {

    const jwt = localStorage.getItem('jwt');

    if (!jwt) {
        window.location.replace("http://127.0.0.1:5500/login.html");
        return null;
    }

    loadingSpinner.classList.remove('hidden');
    container.classList.add('hidden');

    try {
        const response = await fetch("http://127.0.0.1:3000/dashboard", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        });

        const status = response.status;
        const ok = response.ok;
        const body = await response.text();

        console.log("Status:", status);
        console.log("OK?:", ok);
        console.log("Body:", body);

        loadingSpinner.classList.add('hidden');
        container.classList.remove('hidden');

        if (!ok) {
            if (status === 401) {
                alert.innerText = "Session expired. Please log in again.";
                alert.classList.remove("hidden");
            } else if (status === 404) {
                console.log("Dashboard data not found");
            } else if (status === 403) {
                console.log("Forbidden — token not allowed");
            }

            window.location.replace("http://127.0.0.1:5500/login.html");
            return null;
        }

        // Parse JSON
        const data = JSON.parse(body);
        console.log("Dashboard data:", data);

        return data;   // <-- THIS FIXES YOUR ISSUE

    } catch (err) {
        console.error("Fetch error:", err);
        return null;
    }
}

lastEntryButton.addEventListener('click',()=>{
    showLast = !showLast;
    manageLastEntry();
});

entryForm.addEventListener('submit', async (event)=>{
    event.preventDefault();

    const formData = new FormData(event.target);

    const text = formData.get('entryText');
    const painScale = Number(formData.get('painScale'));

    const jwt = localStorage.getItem('jwt');

    var raw = JSON.stringify({
    "text": text,
    "painScale": painScale
    });


    try {
        const response = await fetch("http://127.0.0.1:3000/dashboard/entry", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwt}`
                },
                body: raw
        });

        const status = response.status;
        const ok = response.ok;
        const body = await response.text();

        console.log("Status:", status);
        console.log("OK?:", ok);
        console.log("Body:", body);

        loadingSpinner.classList.add('hidden');
        container.classList.remove('hidden');

        if (!ok) {
            if (status === 401) {
                alert.innerText = "Session expired. Please log in again.";
                alert.classList.remove("hidden");
            } else if (status === 404) {
                console.log("error");
            } else if (status === 403) {
                console.log("Forbidden — token not allowed");
            }

        }

        // Parse JSON
        console.log("New Entry response:", JSON.parse(body));

    } catch (err) {
        console.error("Fetch error:", err);
    }

    entryForm.reset();

});

signOut.addEventListener("click", ()=>{

});

async function manageLastEntry(){
    if(showLast){
        entryForm.classList.toggle("hidden");
        let data = await getLast();
        if(data){
            lastEntry.classList.remove("hidden");
            lastEntryScale.innerText = `Pain scale: ${data.painScale}`;
            lastEntryDate.innerText = `Date: ${data.dateTime}`;
            lastEntryText.innerHTML = `Entry: <br> ${data.text}`;
        }else{
            noLastEntry.classList.remove('hidden');
        }
        lastEntryBox.classList.toggle("lastEntryBoxBorder");
        lastEntryButton.innerText = "Hide Last Journal Entry";
    }else{
        entryForm.classList.remove("hidden");
        lastEntry.classList.add("hidden");
        lastEntryBox.classList.toggle("lastEntryBoxBorder");
        lastEntryButton.innerText = "Show Last Journal Entry";
    }
}

async function getLast(){
    try {
        const jwt = localStorage.getItem('jwt');
        const response = await fetch("http://127.0.0.1:3000/dashboard/entry", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwt}`
                }
        });

        const status = response.status;
        const ok = response.ok;
        const body = await response.text();

        console.log("Status:", status);
        console.log("OK?:", ok);
        console.log("Body:", body);

        loadingSpinner.classList.add('hidden');
        container.classList.remove('hidden');

        if (!ok) {
            if (status === 401) {
                alert.innerText = "Session expired. Please log in again.";
                alert.classList.remove("hidden");
            } else if (status === 404) {
                console.log("error");
            } else if (status === 403) {
                console.log("Forbidden — token not allowed");
            }
            return null
        }

        // Parse JSON
        console.log("New Entry response:", JSON.parse(body));
        return JSON.parse(body);


    } catch (err) {
        console.error("Fetch error:", err);
        return null;
    }

}