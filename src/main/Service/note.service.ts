import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Note } from "../Data Types/Note";
import { Label } from "../Data Types/Label";

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private notes: Note[] = [];
  private labels: Label[] = [];
  private notesSubject: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);
  private labelsSubject: BehaviorSubject<Label[]> = new BehaviorSubject<Label[]>([]);
  private searchDataSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {
    this.getNotes().subscribe((notes) => {
      this.notes = notes;
    });
    this.getLabels().subscribe((labels) => {
      this.labels = labels;
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

  setLabels(labels: Label[]): void {
    this.labelsSubject.next(labels);
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
        if (note.labels) {
          for (const label of note.labels) {
            const labelLower = label.text.toLowerCase();
            if (labelLower.includes(searchDataLower)) {
              note.noteExist = true;
              break;
            }
          }
        }
      }
    }
  }

  getNotes(): Observable<Note[]> {
    return this.notesSubject.asObservable();
  }

  getLabels(): Observable<Label[]> {
    return this.labelsSubject.asObservable();
  }

  toggleCheckBox(note: Note, labelToToggle: Label) {
    const existingLabelIndex = note.labels.findIndex(label => label.id === labelToToggle.id);

    if (existingLabelIndex !== -1) {
      note.labels[existingLabelIndex].showCheckbox = !note.labels[existingLabelIndex].showCheckbox;
      if (!note.labels[existingLabelIndex].showCheckbox) {
        note.labels.splice(existingLabelIndex, 1);
      }
    } else {

      const newLabel: Label = {...labelToToggle, showCheckbox: true};
      note.labels = [newLabel, ...note.labels];
    }
  }

  removeLabel(note: Note, labelToRemove: Label) {

    const labelIndex = note.labels.findIndex(label => label.id === labelToRemove.id);
    if (labelIndex !== -1) {
      note.labels.splice(labelIndex, 1);
    }
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
      showSelectedLabelDropdown: false,
      showSelectedDropdown: false,
      showLabelDropdown: false,
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
      showSelectedLabelDropdown: false,
      showSelectedDropdown: false,
      showLabelDropdown: false,
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
