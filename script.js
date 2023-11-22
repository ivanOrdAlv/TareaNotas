//Iván Ordóñez Álvarez
//Espero que ahora funcione
document.addEventListener("DOMContentLoaded", function () {
    const noteContainer = document.getElementById("note-container");
    const addNoteBtn = document.getElementById("addNoteBtn");
    const deleteAllNotesBtn = document.getElementById("deleteAllNotesBtn");
    const noteModal = document.getElementById("noteModal");
    const noteInput = document.getElementById("noteInput");
    const saveNoteBtn = document.getElementById("saveNoteBtn");

    addNoteBtn.addEventListener("click", openNoteModal);
    deleteAllNotesBtn.addEventListener("click", deleteAllNotes);
    saveNoteBtn.addEventListener("click", saveNote);
    noteModal.querySelector(".close").addEventListener("click", closeNoteModal);

    loadNotes();

    function openNoteModal() {
        noteInput.value = "";
        noteModal.style.display = "block";
    }

    function closeNoteModal() {
        noteModal.style.display = "none";
    }

    function saveNote() {
        //Esto en teoría, guarda la nota en la base de datos
        const noteText = noteInput.value.trim();
        if (noteText !== "") {
            const note = createNoteElement(noteText);
            noteContainer.appendChild(note);
            saveNoteToIndexedDB(noteText);
            closeNoteModal();
        }
    }

    function createNoteElement(text) {
        //Esto crea la nota
        const noteDiv = document.createElement("div");
        noteDiv.className = "note";
        noteDiv.innerHTML = `
            <p>${text}</p>
        `;
        return noteDiv;
    }

    function deleteAllNotes() {
        //Esto en teoría, borra todas las notas de la base de datos
        while (noteContainer.firstChild) {
            noteContainer.removeChild(noteContainer.firstChild);
        }
        deleteAllNotesFromIndexedDB();
    }

    function saveNoteToIndexedDB(noteText) {
        //Esto en teoría, agrega la nota a la base de datos
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('notasDB', 1);

            request.onupgradeneeded = function (event) {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('notas')) {
                    // Crea un almacen de objetos (tabla), campo id como clave primaria y autoincremental
                    db.createObjectStore('notas', { keyPath: 'text' });
                }
            };

            request.onsuccess = function (event) {

                const db = event.target.result;
                const transaction = db.transaction(['notas'], 'readwrite');
                const store = transaction.objectStore('notas');

                const addRequest = store.add({ text: noteText });

                addRequest.onsuccess = function () {

                    resolve();
                };

                addRequest.onerror = function (error) {

                    reject(error);
                };
            };

            request.onerror = function (error) {

                reject(error);
            };
        });
    }

    function deleteNoteFromIndexedDB(noteText) {
        return new Promise((resolve, reject) => {

            const request = indexedDB.open('notasDB', 1);

            request.onsuccess = function (event) {
                const db = event.target.result;
                const transaction = db.transaction(['notas'], 'readwrite');
                const store = transaction.objectStore('notas');

                const deleteRequest = store.delete(noteText);

                deleteRequest.onsuccess = function () {
                    resolve();
                };

                deleteRequest.onerror = function (error) {
                    reject(error);
                };
            };

            request.onerror = function (error) {
                reject(error);
            };
        });
    }

    function deleteAllNotesFromIndexedDB() {
        //Esto en teoría, borra todas las notas de la base de datos
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('notasDB', 1);

            request.onsuccess = function (event) {
                const db = event.target.result;
                const transaction = db.transaction(['notas'], 'readwrite');
                const store = transaction.objectStore('notas');

                const clearRequest = store.clear();

                clearRequest.onsuccess = function () {
                    resolve();
                };

                clearRequest.onerror = function (error) {
                    reject(error);
                };
            };

            request.onerror = function (error) {
                reject(error);
            };
        });
    }

    function loadNotes() {
        //Esto en teoría, carga todas las notas de la base de datos
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('notasDB', 1);
    
            request.onsuccess = function (event) {
                const db = event.target.result;
                const transaction = db.transaction(['notas'], 'readonly');
                const store = transaction.objectStore('notas');
    
                const getAllRequest = store.getAll();
    
                getAllRequest.onsuccess = function () {
                    const notes = getAllRequest.result;
                    notes.forEach(note => {
                        const noteElement = createNoteElement(note.text);
                        noteContainer.appendChild(noteElement);
                    });
                    resolve();
                };
    
                getAllRequest.onerror = function (error) {
                    reject(error);
                };
            };
    
            request.onerror = function (error) {
                reject(error);
            };
        });
    }
    
});
