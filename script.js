let notes = [];
let titles = [];
let deletedNotes = []; //archived
let deletedTitles = []; //archived


async function onPageLoad() {
    load();
    await includeHTML();
    renderNotes();
}


async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


function load() {
    let notesAsText = localStorage.getItem('notes');
    let titlesAsText = localStorage.getItem('titles');
    let deletedNotesAsText = localStorage.getItem('deletedNotes');
    let deletedTitlesAsText = localStorage.getItem('deletedTitles');
    if (notesAsText && titlesAsText && deletedNotesAsText && deletedTitlesAsText) {
        notes = JSON.parse(notesAsText);
        titles = JSON.parse(titlesAsText);
        deletedNotes = JSON.parse(deletedNotesAsText);
        deletedTitles = JSON.parse(deletedTitlesAsText);
    }
}


function toggleMenu() {
    var checkbox = document.getElementById("menu-toggle");
    if (checkbox !== null) {
        checkbox.click();
    }
}


function renderNotes() {
    let content = document.getElementById('content');
    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        const title = titles[i];
        content.innerHTML = /*html*/`
            <div class="all">  
                <div class="main"> 
                    <div class = "note">
                        <span class="bold">${title}</span><br><br>${note}
                    </div>
                    <!--  <button onclick="deleteNote(${i})"><input type="image" class="symbols" img src="img/bin (3).png"></button> -->
                    <a href="#" class="button" onclick="deleteNote(${i})">
                        <img src="img/trash.png">
                        <span>Delete</span>
                    </a>
                </div>
            </div>
        `;
    }
}


function renderDeletedNotes() {
    let content = document.getElementById('content');
    for (let i = 0; i < deletedTitles.length; i++) {
        const deletedNote = deletedNotes[i];
        const deletedTitle = deletedTitles[i];
        content.innerHTML += /*html*/`
            <div class="main">
                <div class = "note">
                    <span class="bold">${deletedTitle}</span><br><br>${deletedNote}
                </div>
                <!-- <button onclick="deletePermanent(${i})"><input type="image" class="symbols" img src="img/bin (3).png"><br>delete</button> -->
                <div class="note-button-group">
                    <a href="#" class="button" onclick="deletePermanent(${i})">
                        <img src="img/warning.png"><br>
                        <span>Delete</span>
                    </a>
                    <!-- <button onclick="restoreNote(${i})">RESTORE</button> -->
                    <a href="#" class="button" onclick="restoreNote(${i})">
                        <img src="img/move.png"><br>
                        <span>Restore</span>
                    </a>
                </div> 
            </div>
        `;
    }
    
}


function addNote() {
    let note = document.getElementById('textarea');
    let title = document.getElementById('title');
    notes.push(note.value);
    titles.push(title.value);
    render();
    save();
}


function val() {
    return !(document.getElementById("title").value == null || document.getElementById("title").value == ""     //! means that the content of the brackets is negated (False) same as  //    if (x) return -x  else: return x  ! means * -1    
        || document.getElementById("textarea").value == null || document.getElementById("textarea").value == "");
    //if (x === true) return false
    //    else: return true 
    //    if (x) return -x
    //    else: return x 
    //    ! means * -1
}


function deleteNote(i) {
    const removedNote = notes.splice(i, 1);
    const removedTitle = titles.splice(i, 1);
    deletedNotes.push(removedNote);
    deletedTitles.push(removedTitle);
    render();
    save();
}


function restoreNote(i) {
    const renewedNote = deletedNotes.splice(i, 1);
    const renewedTitle = deletedTitles.splice(i, 1);
    notes.push(renewedNote);
    titles.push(renewedTitle);
    renderDeletedNotes();
    save();
}


function deletePermanent(i) {
    deletedNotes.splice(i, 1);
    deletedTitles.splice(i, 1);
    renderDeletedNotes();
    save();
}


function save() {
    let notesAsText = JSON.stringify(notes);
    localStorage.setItem('notes', notesAsText);
    let titlesAsText = JSON.stringify(titles);
    localStorage.setItem('titles', titlesAsText);
    let deletedNotesAsText = JSON.stringify(deletedNotes);
    localStorage.setItem('deletedNotes', deletedNotesAsText);
    let deletedTitlesAsText = JSON.stringify(deletedTitles);
    localStorage.setItem('deletedTitles', deletedTitlesAsText);
}


function validateAndSave() {
    if (val() === true) {
        addNote();
    } else {
       openDialog();
    }
}

function openDialog() {
    document.getElementById('dialog').classList.remove('d-none');
    }


function closeDialog() {
    document.getElementById('dialog').classList.add('d-none');
}
/* var textarea = document.getElementById("textarea");
if (textarea) {
    textarea.addEventListener("keyup", function (e) {
        if (e.key === "Enter") {
            addNote();
        }
    })
}*/