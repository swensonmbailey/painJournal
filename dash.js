

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
const loadingSpinner = document.getElementById("loadingSpinner");
const lastEntrySpinner = document.getElementById("lastEntryLoadingSpinner");
const entryFormSpinner = document.getElementById("entryFormLoadingSpinner");
const container = document.getElementById("container");
const cancelButton = document.getElementById("cancelButton");

let lastEntryId = null;
let lastEntryTextSaved = null;
let lastEntryScaleSaved = null;

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

            console.log(status);
            console.log(body);

            if (status >= 500) {
                alert.classList.remove("hidden");
            } else{
                window.location.replace("http://127.0.0.1:5500/login.html");
            }
            return null;
        }

        // Parse JSON
        const data = JSON.parse(body);
        console.log("Dashboard data:", data);

        return data;   

    } catch (err) {
       console.log("Fetch error:", err);
        return null;
    }
}

lastEntryButton.addEventListener('click',()=>{
    showLast = !showLast;
    manageLastEntry();
});

entryForm.addEventListener('submit', async (event)=>{
    event.preventDefault();

   manageSubmit(event);

});

signOut.addEventListener("click", ()=>{

    localStorage.removeItem('jwt');
    window.location.replace("http://127.0.0.1:5500/login.html");

});

lastEntryEdit.addEventListener("click", ()=>{
    showLast = !showLast;
    manageLastEntry();
    editLast = true;
    manageEditEntry();
})

cancelButton.addEventListener("click", ()=>{
    editLast = false;
    manageEditEntry();
})

async function manageLastEntry(){
    if(showLast){
        lastEntryBox.classList.toggle("lastEntryBoxBorder");
        lastEntryButton.classList.add("hidden");
        entryForm.classList.add("hidden");
        let data = await getLast();
        lastEntryButton.classList.remove("hidden");
        lastEntryButton.innerText = "Hide Last Journal Entry";
        if(data){
            lastEntry.classList.remove("hidden");
            lastEntry.classList.add("lastEntry");
            lastEntryScale.innerText = `Pain: ${data.painScale}`;

            const date = new Date(data.dateTime);
            const formatted = date.toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });


            lastEntryDate.innerText = `${formatted}`;
            lastEntryText.innerHTML = `${data.text}`;
            lastEntryId = data.id;
            lastEntryTextSaved = data.text;
            lastEntryScaleSaved = data.painScale;
        }else{
            noLastEntry.classList.remove('hidden');
        }
        
    }else{
        entryForm.classList.remove("hidden");
        noLastEntry.classList.add('hidden');
        lastEntry.classList.add("hidden");
        lastEntry.classList.remove("lastEntry");
        lastEntryBox.classList.toggle("lastEntryBoxBorder");
        lastEntryButton.innerText = "Show Last Journal Entry";
    }
}

function manageEditEntry(){
    if(editLast){
        entryTitle.innerText = "Edit Last Entry";
        submitEntry.value = "Edit Entry"
        cancelButton.classList.remove("hidden");
        lastEntryButton.classList.add("hidden");

        entryText.value = lastEntryTextSaved;
        painScale.value = lastEntryScaleSaved;

    }else{
        entryTitle.innerText = "Submit New Entry";
        submitEntry.value = "Submit Entry"
        cancelButton.classList.add("hidden");
        lastEntryButton.classList.remove("hidden");

        entryForm.reset();

    }
}

async function manageSubmit(event){

    if(editLast){
        await editLastEntry(event);
    }else{
        await makeNewEntry(event);
    }
}

async function makeNewEntry(event) {
    const formData = new FormData(event.target);

    const text = formData.get('entryText');
    const painScale = Number(formData.get('painScale'));

    const jwt = localStorage.getItem('jwt');

    var raw = JSON.stringify({
    "text": text,
    "painScale": painScale
    });

    entryFormSpinner.classList.remove('hidden');
    document.querySelectorAll('.entryFormInput').forEach(el => {
        el.classList.add('hidden');
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

        entryFormSpinner.classList.add('hidden');
        document.querySelectorAll('.entryFormInput').forEach(el => {
            el.classList.remove('hidden');
        });

        if (!ok) {

            alert.classList.remove("hidden");

        }

        // Parse JSON
        console.log("New Entry response:", JSON.parse(body));

    } catch (err) {
       console.log("Fetch error:", err);
    }

    entryForm.reset();
}

async function editLastEntry(event){
    const formData = new FormData(event.target);

    const text = formData.get('entryText');
    const painScale = Number(formData.get('painScale'));

    const jwt = localStorage.getItem('jwt');

    var raw = JSON.stringify({
    "text": text,
    "painScale": painScale,
    "entryId": lastEntryId
    });

    entryFormSpinner.classList.remove('hidden');
    document.querySelectorAll('.entryFormInput').forEach(el => {
        el.classList.add('hidden');
    });


    try {
        const response = await fetch("http://127.0.0.1:3000/dashboard/entry", {
                method: "PUT",
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

        entryFormSpinner.classList.add('hidden');
        document.querySelectorAll('.entryFormInput').forEach(el => {
            el.classList.remove('hidden');
        });

        if (!ok) {

            alert.classList.remove("hidden");

        }

        // Parse JSON
        console.log("New Entry response:", JSON.parse(body));
        editLast = !editLast;
        manageEditEntry();

    } catch (err) {
       console.log("Fetch error:", err);
    }

    entryForm.reset();
}

async function getLast(){
    try {

        lastEntrySpinner.classList.remove('hidden');

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

        lastEntrySpinner.classList.add('hidden');
        

        if (!ok) {
            alert.classList.remove("hidden");
            return null
        }

        // Parse JSON
        console.log("New Entry response:", JSON.parse(body));
        return JSON.parse(body);


    } catch (err) {
       console.log("Fetch error:", err);
        return null;
    }

}