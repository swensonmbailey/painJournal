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


let showLast = false;
let editLast = false;

lastEntryButton.addEventListener('click',()=>{
    showLast = !showLast;
    manageLastEntry();
});

submitEntry.addEventListener('click', ()=>{

});

signOut.addEventListener("click", ()=>{

});

function manageLastEntry(){
    if(showLast){
        entryForm.classList.toggle("hidden");
        lastEntry.classList.toggle("hidden");
        lastEntryBox.classList.toggle("lastEntryBoxBorder");
        lastEntryButton.innerText = "Hide Last Journal Entry";
    }else{
        entryForm.classList.toggle("hidden");
        lastEntry.classList.toggle("hidden");
        lastEntryBox.classList.toggle("lastEntryBoxBorder");
        lastEntryButton.innerText = "Show Last Journal Entry";
    }
}
