import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Note } from "../Data Types/Note";
import { Label } from "../Data Types/Label";
import { AppConstants } from "../Constants/app-constant";

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  filteredNotes: Note[] = [];
  private notes: Note[] = [];
  private labels: Label[] = [];
  private notesSubject: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);
  private labelsSubject: BehaviorSubject<Label[]> = new BehaviorSubject<Label[]>([]);
  private searchDataSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');


  constructor() {
    this.loadNotesFromLocalStorage();
    this.loadLabelsFromLocalStorage();
  }

  getSearchedData(): Observable<string> {
    return this.searchDataSubject.asObservable();
  }

  closeDropdownsExceptThisNote(clickedNote: Note): void {
    this.notes.forEach((note) => {
      if ((note.showDropdown || note.showLabelDropdown) && note !== clickedNote) {
        note.showDropdown = false;
        note.showLabelDropdown = false;
      }
    });
  }

  isNotesSimpleAndArchive(): boolean {
    return this.filteredNotes.some((note) => note.isArchived) &&
      this.filteredNotes.some((note) => !note.isArchived);
  }

  setSearchedData(data: string): void {
    this.searchDataSubject.next(data);
  }

  setLabels(labels: Label[]): void {
    this.labelsSubject.next(labels);
    this.labels = labels;
    this.saveLabelsToLocalStorage();
  }

  notesExist(data: string): void {
    this.searchDataSubject.next(data);
    this.filteredNotes = [];
    const searchDataLower = data.trim().toLowerCase();
    if (!searchDataLower) {
      this.notesSubject.next(this.filteredNotes);
      this.saveNotesToLocalStorage();
      return; // No need to process notes if search data is empty
    }
    this.notes.forEach(note => {
      const matchedNote = this.doesNoteMatchSearch(note, searchDataLower);
      if (matchedNote) {
        this.filteredNotes.push(matchedNote);
      }
    });

    this.notesSubject.next(this.filteredNotes);
    this.saveNotesToLocalStorage();
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
      // Label found in note's list, remove it
      note.labels.splice(existingLabelIndex, 1);
    } else {
      // Label not found, add it to the note's list
      const newLabel: Label = {...labelToToggle};
      note.labels.push(newLabel);
    }
    this.saveNotesToLocalStorage();
  }

  removeLabel(note: Note, labelToRemove: Label) {

    const labelIndex = note.labels.findIndex(label => label.id === labelToRemove.id);
    if (labelIndex !== -1) {
      note.labels.splice(labelIndex, 1);
      this.saveNotesToLocalStorage();
    }
  }

  addNote(title: string, message: string, isArchived: boolean = false) {
    if (!title && !message) {
      return;
    }

    const newNote: Note = {
      id: this.notes.length + 1,
      title: title || '',
      content: message || '',
      isArchived: isArchived,
      showDropdown: false,
      labels: [],
      showLabelDropdown: false,
    };

    this.notes.unshift(newNote);
    this.notesSubject.next(this.notes);
    this.saveNotesToLocalStorage();
  }

  addAndArchive(title: string, message: string) {
    this.addNote(title, message, true);

  }

  updateNote(selectedNote: Note | null): null {
    if (selectedNote) {
      const noteIndex = this.notes.findIndex((note) => selectedNote.id === note.id);
      if (noteIndex !== -1) {
        this.notes[noteIndex].content = selectedNote.content;
        this.notes[noteIndex].title = selectedNote.title;
        this.notes[noteIndex].labels = selectedNote.labels;
        this.saveNotesToLocalStorage();
      }
    }
    return null;
  }

  toggleArchive(id: number, archive: boolean): void {
    const noteIndex = this.notes.findIndex((note) => note.id === id);

    if (noteIndex >= 0) {
      this.notes[noteIndex].isArchived = archive;
      this.saveNotesToLocalStorage();
    }
  }

  deleteNote(id: number): Observable<Note[]> {
    const noteIndexToDelete = this.notes.findIndex((note) => note.id === id);

    if (noteIndexToDelete >= 0) {
      this.notes.splice(noteIndexToDelete, 1);
      this.notesSubject.next(this.notes);
      this.saveNotesToLocalStorage();
    }

    return this.notesSubject.asObservable();
  }

  archiveNote(id: number) {
    this.toggleArchive(id, true);
    return this.notes;
  }

  unArchiveNote(id: number) {
    this.toggleArchive(id, false);
    return this.notes;
  }

  private loadNotesFromLocalStorage(): void {
    const storedNotes = localStorage.getItem(AppConstants.STORAGE_KEY_NOTES);
    if (storedNotes) {
      this.notes = JSON.parse(storedNotes);
      this.updateNotesDropdownState();
      this.notesSubject.next(this.notes);
    }
  }

  private loadLabelsFromLocalStorage(): void {
    const storedLabels = localStorage.getItem(AppConstants.STORAGE_KEY_LABELS);
    if (storedLabels) {
      this.labels = JSON.parse(storedLabels);
      this.updateLabelsDropdownState();
      this.labelsSubject.next(this.labels);
    }
  }

  private updateLabelsDropdownState(): void {
    this.labels.forEach((label) => {
      label.showCrossIcon = false;
    });
  }

  private updateNotesDropdownState(): void {
    this.notes.forEach((note) => {
      note.showLabelDropdown = false;
      note.showDropdown = false;
    });
  }

  private saveNotesToLocalStorage(): void {
    localStorage.setItem(AppConstants.STORAGE_KEY_NOTES, JSON.stringify(this.notes));
  }

  private saveLabelsToLocalStorage(): void {
    localStorage.setItem(AppConstants.STORAGE_KEY_LABELS, JSON.stringify(this.labels));
  }

  private doesNoteMatchSearch(note: Note, searchDataLower: string): Note | undefined {
    const titleLower = note.title.toLowerCase();
    const contentLower = note.content.toLowerCase();

    if (titleLower.includes(searchDataLower) || contentLower.includes(searchDataLower)) {
      return note;
    }
    if (note.labels && note.labels.some(label => label.text.toLowerCase().includes(searchDataLower))) {
      return note;
    }
    return undefined;
  }


}
