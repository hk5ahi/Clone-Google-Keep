import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Note } from "../Data Types/Note";

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private notes: Note[] = [];
  private notesSubject: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);
  private searchDataSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {
    this.getNotes().subscribe((notes) => {
      this.notes = notes;
    });

  }

  getSearchedData(): Observable<string> {
    return this.searchDataSubject.asObservable();
  }

  isNotesSimpleAndArchive(): boolean {
    let hasArchived = false;
    let hasUnarchived = false;

    for (const note of this.notes) {
      if (note.isArchived && note.noteExist) {
        hasArchived = true;
      } else if (!note.isArchived && note.noteExist) {
        hasUnarchived = true;
      }
    }
    return hasArchived && hasUnarchived;
  }

  setSearchedData(data: string): void {
    this.searchDataSubject.next(data);
  }

  notesExist(data: string): void {

    this.searchDataSubject.next(data);
    for (const note of this.notes) {
      note.noteExist = false;
    }
    const searchDataLower = data.toLowerCase();

    if (data.trim() !== '') {

      for (const note of this.notes) {

        const titleLower = note.title.toLowerCase();
        const contentLower = note.content.toLowerCase();

        if (titleLower.includes(searchDataLower) || contentLower.includes(searchDataLower)) {
          note.noteExist = true;
        }
      }
    }
  }

  getNotes(): Observable<Note[]> {
    return this.notesSubject.asObservable();
  }

  addAndArchive(title: string, message: string) {
    if (title === '' && message === '') {
      return;
    }
    const newNote: Note = {
      id: this.notes.length + 1, // Generate a unique ID
      title: title || '',
      content: message || '',
      isArchived: true,
      showDropdown: false,
      isHidden: false,
      isMoreIconClicked: false,
      noteExist: false,
      labels: [],
    };

    this.notes.unshift(newNote);
    this.notesSubject.next(this.notes);
  }

  addNote(title: string, noteMessage: string) {
    const newNote: Note = {
      id: this.notes.length + 1, // Generate a unique ID
      title: title,
      content: noteMessage,
      isArchived: false,
      showDropdown: false,
      isHidden: false,
      isMoreIconClicked: false,
      noteExist: false,
      labels: [],
    };

    this.notes.unshift(newNote);
    this.notesSubject.next(this.notes);
  }

  updateNote(selectedNote: Note | null): null {
    if (selectedNote) {
      const noteIndex = this.notes.findIndex((note) => selectedNote.id === note.id);
      if (noteIndex !== -1) {
        this.notes[noteIndex].content = selectedNote.content;
        this.notes[noteIndex].title = selectedNote.title;
      }
    }
    return null;
  }

  makeAllNotesVisible(): Note[] {
    for (const note of this.notes) {
      note.isHidden = false;
    }
    return this.notes;
  }

  archiveNote(id: number) {

    const noteIndexToArchive = this.notes.findIndex((note) => note.id === id);
    if (noteIndexToArchive >= 0) {

      this.notes[noteIndexToArchive].isArchived = true;
      this.notes[noteIndexToArchive].isHidden = false;
    }
    return this.notes;
  }

  unArchiveNote(id: number) {

    const noteIndexToUnArchive = this.notes.findIndex((note) => note.id === id);

    if (noteIndexToUnArchive >= 0) {
      this.notes[noteIndexToUnArchive].isArchived = false;
      this.notes[noteIndexToUnArchive].isHidden = false;
    }

    return this.notes;
  }

  deleteNote(id: number): Observable<Note[]> {
    const noteIndexToDelete = this.notes.findIndex((note) => note.id === id);
    if (noteIndexToDelete >= 0) {
      this.notes.splice(noteIndexToDelete, 1);
      this.notesSubject.next(this.notes);
    }
    return this.notesSubject.asObservable();
  }

  changeHiddenStatus(id: number, isHidden: boolean) {

    const noteIndexToHide = this.notes.findIndex((note) => note.id === id);
    if (noteIndexToHide >= 0) {
      this.notes[noteIndexToHide].isHidden = isHidden;
    }
    return this.notes;
  }
}
