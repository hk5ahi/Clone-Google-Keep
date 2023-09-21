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
      this.notes = notes.reverse();
    });

  }
  getSearchedData(): Observable<string> {
    return this.searchDataSubject.asObservable();
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

    if (title != '' && message != '') {
      const newNote: Note = {
        id: this.notes.length + 1, // Generate a unique ID
        title: title,
        content: message,
        isArchived: true,
        showDropdown: false,
        isHidden: false,
        isMoreIconClicked: false,
        noteExist: false,
      };
      this.notes.push(newNote);
      this.notesSubject.next(this.notes);
    } else if (title != '' && message == '') {
      const newNote: Note = {
        id: this.notes.length + 1, // Generate a unique ID
        title: title,
        content: '',
        isArchived: true,
        showDropdown: false,
        isHidden: false,
        isMoreIconClicked: false,
        noteExist: false,
      };
      this.notes.push(newNote);
      this.notesSubject.next(this.notes);
    } else if (title == '' && message != '') {
      const newNote: Note = {
        id: this.notes.length + 1, // Generate a unique ID
        title: '',
        content: message,
        isArchived: true,
        showDropdown: false,
        isHidden: false,
        isMoreIconClicked: false,
        noteExist: false,
      };
      this.notes.push(newNote);
      this.notesSubject.next(this.notes);
    } else {
      return;
    }
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
    };

    this.notes.push(newNote);
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

  changeHiddenStatus(id: number) {

    const noteIndexToHide = this.notes.findIndex((note) => note.id === id);

    if (noteIndexToHide >= 0) {

      this.notes[noteIndexToHide].isHidden = false;
    }
    return this.notes;
  }
}
