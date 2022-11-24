let notes = [];
let titles = [];
let deletedNotes = []; //archived
let deletedTitles = []; //archived
load();


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
    let deletedNotesAsText = localStorage.getItem('deletedNotes')
    let deletedTitlesAsText = localStorage.getItem('deletedTitles')
    if (notesAsText && titlesAsText && deletedNotesAsText && deletedTitlesAsText) {
        notes = JSON.parse(notesAsText);
        titles = JSON.parse(titlesAsText);
        deletedNotes = JSON.parse(deletedNotesAsText);
        deletedTitles = JSON.parse(deletedTitlesAsText);
    }
}

function render() {
    let content = document.getElementById('content');
    content.innerHTML = /*html*/`
<!-- render Textareasection -->
   <div class="all">
        <div class="main">
            <div class="nav">
               <!--  <button onclick="render()"><input type="image" class="symbols" img src="img/note.png"></button> -->
                <a href="#" onclick="render()">
                    <img src="img/note.png"><br>
                    <span>Notes</span>
                </a>
               <!--  <button onclick="renderDeletedNotes()"><input type="image" class="symbols" img src="img/archive.png"><br>deleted<br>notes</button> -->
                <a href="#" onclick="renderDeletedNotes()">
                    <img src="img/archive.png"><br>
                    <span>Archiv</span>
                </a>
            </div>
            <div class="textarea-section">
                <h1>Notes</h1>
                <textarea id="title" class="textarea-title" placeholder="title"></textarea>
                <textarea id="textarea" placeholder="notes - press enter to submit" cols="30" rows="10"></textarea>
                <!-- <button onclick="validateAndSave()"><input type="image" class="symbols" img src="img/save.png"></button> -->
                <a href="#" onclick="validateAndSave()">
                    <img src="img/save.png">
                    <span>Save</span>
                </a>
            </div>
        </div>        
    </div>
    `;

/* renderNotes NOTES */
    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        const title = titles[i];
        content.innerHTML += /*html*/`
        <div class="all">  
            <div class="main">
                <div class="nav"></div>
                    <div class="note-section">
                        <div class = "saved-note"><span class="bold">${title}</span><br><br>${note}</div>
                       <!--  <button onclick="deleteNote(${i})"><input type="image" class="symbols" img src="img/bin (3).png"></button> -->
                        <a href="#" onclick="deleteNote(${i})">
                        <img src="img/save.png"><br>
                        <span>Delete</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        `;
    } 
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
 /* render DELETED NOTES */  
function renderDeletedNotes(){
    let content = document.getElementById('content');
    content.innerHTML = /*html*/ `
   
    <div class="all">
        <div class="main">
        <div class="nav">
               <!--  <button onclick="renderDeletedNotes()"><input type="image" class="symbols" img src="img/archive.png"></button> -->
                <a href="#" onclick="renderDeletedNotes()">
                    <img src="img/archive.png"><br>
                    <span>Archiv</span>
                </a>
                <!-- <button onclick="render()"><input type="image" class="symbols" img src="img/note.png"></button> -->
                <a href="#" onclick="render()">
                    <img src="img/note.png"><br>
                    <span>Notes</span>
                </a>
            </div>   
                <div class="textarea-section">
                <h1>Deleted Notes</h1>
            </div>
        </div>
        </div>
    </div>
            `;
            
    for (let i = 0; i < deletedTitles.length; i++){
        const deletedNote = deletedNotes[i];
        const deletedTitle = deletedTitles[i];
        content.innerHTML += /*html*/`
      <div class="all">  
            <div class="main">
            <div class="nav"></div>
                    <div class="note-section">
                        <div class = "saved-note"><span class="bold">${deletedTitle}</span><br><br>${deletedNote}</div>
                        <!-- <button onclick="deletePermanent(${i})"><input type="image" class="symbols" img src="img/bin (3).png"><br>delete</button> -->
                        <a href="#" onclick="deletePermanent(${i})">
                        <img src="#"><br>
                        <span>Delete permanently</span>
                        <!-- <button onclick="restoreNote(${i})">RESTORE</button> -->
                        <a href="#" onclick="restoreNote(${i})">
                        <img src="#"><br>
                        <span>Restore</span>
                </a>
                    </div>
                </div> 
            
        </div>
    </div> ` 
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
      return !(document.getElementById("title").value==null || document.getElementById("title").value==""     //! means that the content of the brackets is negated  same as  //    if (x) return -x  else: return x  ! means * -1    
      || document.getElementById("textarea").value==null || document.getElementById("textarea").value=="")    // das was in der Klammer steht ist falsch                                                                                                         
      //if (x === true) return false
      //    else: return true 
      //    if (x) return -x
      //    else: return x 
      //    ! means * -1
    } 

function deleteNote(i) {
    const removedNote = notes.splice(i, 1);
    deletedNotes.push(removedNote);
    console.log(deletedNotes);
    const removedTitle = titles.splice(i, 1);
    deletedTitles.push(removedTitle);
    console.log(deletedTitles);
    render();
    save();
}

function restoreNote(i){
    const renewedNote = deletedNotes.splice(i, 1);
    notes.push(renewedNote);
    const renewedTitle = deletedTitles.splice(i, 1);
    titles.push(renewedTitle);
    renderDeletedNotes();
    save();
}

function deletePermanent(i){
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
        if(val() === true){
            addNote();
        } else {
            alert("blank text area")
        }
    }
