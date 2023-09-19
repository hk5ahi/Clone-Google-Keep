import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Note} from "../Data Types/Note";


@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private notes: Note[] = [];
  private notesSubject: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);

  constructor() {
  }

  getNotes(): Observable<Note[]> {
    return this.notesSubject.asObservable();
  }

  addNote(title: string, noteMessage: string) {
    const newNote: Note = {
      id: this.notes.length + 1, // Generate a unique ID
      title: title,
      content: noteMessage,
      isArchived: false,
      showDropdown: false,
    };

    this.notes.push(newNote);
    this.notesSubject.next(this.notes);
  }

updateNote(note:Note|null):null
{
  if (note) {
    // Find the index of the selected note in the notes array
    const noteIndex = this.notes.findIndex((note) => note.id === note.id);

    if (noteIndex !== -1) {
      // Update the content of the selected note
      this.notes[noteIndex].content = note.content;

      // Reset the selectedNote to null to exit editing mode

    }
  }
  return null;
}
  archiveNote(id: number) {

    // Find the index of the note with the matching title
    const noteIndexToArchive = this.notes.findIndex((note) => note.id === id);

    // Check if the note was found (noteIndexToArchive >= 0)
    if (noteIndexToArchive >= 0) {
      // Archive the note by setting isArchived to true
      this.notes[noteIndexToArchive].isArchived = true;
    }
    return this.notes;

  }
  unArchiveNote(id: number) {

    const noteIndexToUnArchive = this.notes.findIndex((note) => note.id === id);


    if (noteIndexToUnArchive >= 0) {

      this.notes[noteIndexToUnArchive].isArchived = false;
    }

    return this.notes;
  }
  deleteNote(id: number):Observable<Note[]> {
    const noteIndexToDelete = this.notes.findIndex((note) => note.id === id);

    if (noteIndexToDelete >= 0) {
      // Remove the note from the array by its index
      this.notes.splice(noteIndexToDelete, 1);
      // Optionally, you can update your observable or service to reflect the changes.
      this.notesSubject.next(this.notes);

    }
    return this.notesSubject.asObservable();
  }



}
