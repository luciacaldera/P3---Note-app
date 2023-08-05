'use strict';

const formElement = document.querySelector('#new-note-form');
const notesContainer = document.querySelector('#notes-container');

function displayData() {
  //Loading the tasks from local storage when the page loads
  const taskData = localStorage.getItem('notes');
  //load data or empty array if none
  const notes = JSON.parse(taskData) || [];
  //resetting old data
  notesContainer.innerHTML = '';
  //reloading the grid slots with the data to display
  notes.forEach((note) => {
    const noteDivHtml = `<div id="${note.id}" class="note"><h2>${note.title}</h2>
<span>${note.body}</span><button id="edit-btn" type="button">Edit</button
><button id="delete-btn" type="button">Delete</button>
</div>`;
    notesContainer.innerHTML += noteDivHtml;
  });
}

displayData();

//Limiting characters in the form input fields
const noteTitleInput = document.querySelector('#title-input');
const noteTextInput = document.querySelector('#text-area');
noteTitleInput.setAttribute('maxlength', '12');
noteTextInput.setAttribute('maxlength', '60');

//Adding a new task and saving it to the local storage
formElement.addEventListener('submit', (e) => {
  e.preventDefault();
  //Loading the tasks from local storage
  const taskData = localStorage.getItem('notes');
  //load data or empty array if none
  const notes = JSON.parse(taskData) || [];
  const noteText = document.querySelector('#text-area').value.trim();
  const noteTitle = document.querySelector('#title-input').value.trim();

  const newNote = {
    title: noteTitle || `Note ${notes.length + 1}`,
    body: `${noteText}`,
    id: Math.floor(Math.random() * 100000),
  };
  //saving the new note into the array
  notes.push(newNote);
  //saving it into the local storage
  localStorage.setItem('notes', JSON.stringify(notes));
  // update the DOM to show the new note
  const noteDivHtml = `<div id="${newNote.id}" class="note"><h2>${newNote.title}</h2>
   <span>${newNote.body}</span><button id="edit-btn" type="button">Edit</button>
   <button id="delete-btn" type="button">Delete</button>
   </div>`;
  notesContainer.innerHTML += noteDivHtml;
});

notesContainer.addEventListener('click', (e) => {
  e.preventDefault();
  //getting the ID of the note to modfy
  const noteId = parseInt(e.target.parentNode.id);
  //selecting the div with that id in the DOM
  const noteToModify = document.getElementById(noteId);

  //handling delete functionality
  if (e.target.matches('#delete-btn')) {
    //removing the deleted note from the DOM
    noteToModify.parentNode.removeChild(noteToModify);
    //creating a new array to load data from the updated dom elements
    const updatedNotes = [];
    //selecting all the notes from the dom
    const noteDivs = notesContainer.querySelectorAll('.note');
    //looping over the dom notes to get the data and create new objects to add to the array
    noteDivs.forEach((noteDiv) => {
      const id = parseInt(noteDiv.id);
      const title = noteDiv.querySelector('h2').innerText;
      const body = noteDiv.querySelector('span').innerText;
      updatedNotes.push({ id, title, body });
    });
    //saving the new array into the local storage, replacing the old data
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  }
  //handling edit functionality
  else if (e.target.matches('#edit-btn')) {
    //setting the inputs with the selected note content
    document.querySelector('#title-input').value =
      noteToModify.querySelector('h2').innerText;
    document.querySelector('#text-area').value =
      noteToModify.querySelector('span').innerText;

    //hiding and showing edit/cancel button
    const actionsDiv = document.querySelector('.actions');
    actionsDiv.innerHTML = `<button id="edit-note" class="button" type="submit">
  Edit note
</button>`;

    //function to update local storage with the edited note and the rest of the notes
    function updateLocalStorage() {
      const updatedNotes = [];
      const noteDivs = notesContainer.querySelectorAll('.note');
      noteDivs.forEach((noteDiv) => {
        const id = parseInt(noteDiv.id);
        const title = noteDiv.querySelector('h2').innerText;
        const body = noteDiv.querySelector('span').innerText;
        updatedNotes.push({ id, title, body });
      });
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
    }

    //handling form submition to edit
    const editBtn = document.querySelector('#edit-note');
    editBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const editedNoteTitle = document.querySelector('#title-input').value;
      const editedNoteText = document.querySelector('#text-area').value;
      noteToModify.querySelector('h2').innerText = editedNoteTitle;
      noteToModify.querySelector('span').innerText = editedNoteText;
      // call the function to update local storage
      updateLocalStorage();
      //hiding and showing edit/cancel button and resetting inputs
      actionsDiv.innerHTML = `<button id="add-note" class="button" type="submit">Add note</button>`;
      formElement.reset();
    });
  }
});
