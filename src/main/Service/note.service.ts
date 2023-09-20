import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Note } from "../Data Types/Note";

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private notes: Note[] = [];
  private notesSubject: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);

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

    const noteIndexToArchive = this.notes.findIndex((note) => note.title === title);


    if (noteIndexToArchive >= 0) {

      this.notes[noteIndexToArchive].isArchived = true;
    }
    return this.notes;

  }

}
