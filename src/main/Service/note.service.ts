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
      title: title,
      content: noteMessage,
      isArchived: false,
    };

    this.notes.push(newNote);
    this.notesSubject.next(this.notes);
  }

  archiveNote(title: string) {

    // Find the index of the note with the matching title
    const noteIndexToArchive = this.notes.findIndex((note) => note.title === title);

    // Check if the note was found (noteIndexToArchive >= 0)
    if (noteIndexToArchive >= 0) {
      // Archive the note by setting isArchived to true
      this.notes[noteIndexToArchive].isArchived = true;
    } else {
      // Handle the case where the note with the specified title was not found.
      console.log('Note not found. Unable to archive.');
    }
    console.log(this.notes);
    // Return the updated list of notes (optional)
    return this.notes;

  }

}
