import {Component, ElementRef, HostListener, OnInit} from '@angular/core';

import {NoteService} from '../../../Service/note.service';
import {Note} from "../../../Data Types/Note";
import {BehaviorSubject, map, Observable, of, Subscription} from "rxjs";

@Component({
  selector: 'app-keep-notes',
  templateUrl: './keep-notes.component.html',
  styleUrls: ['./keep-notes.component.scss'],
})
export class KeepNotesComponent implements OnInit {
  notes: Note[] = [];
  isArchiveNotesPresent: boolean = false;
  selectedNote: Note | null = null; // Initialize as null

  constructor(private noteService: NoteService, private elementRef: ElementRef) {
  }

  selectNoteForEditing(note: Note) {
    this.selectedNote = note;
    this.notes.forEach((note) => {
        note.isHidden = false;
      }
    );
    if (!note.isMoreIconClicked) {
      note.isHidden = true;
    }

  }


  saveNoteChanges() {

    this.selectedNote = this.noteService.updateNote(this.selectedNote);

  }

  handleMoreIconClick(event: MouseEvent, note: Note) {
    note.showDropdown = !note.showDropdown;
    event.stopPropagation();
    note.isMoreIconClicked = !note.isMoreIconClicked;

  }

  closeEditor(note: Note) {
    this.saveNoteChanges();
    this.selectedNote = null;
    note.isHidden = false;

  }

  hasNotes() {
    return this.notes.length > 0;
  }

  ngOnInit(): void {
    this.noteService.getNotes().subscribe((notes) => {
      this.notes = notes;

    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {

    if (!this.elementRef.nativeElement.contains(event.target)) {

      this.notes.forEach((note) => {
          note.showDropdown = false;
        }
      );

    }
  }

  archiveNote(id: number) {

    this.notes = this.noteService.archiveNote(id);
    console.log(this.notes);
  }

  isArchiveNotes() {
    this.isArchiveNotesPresent = this.notes.every((note) => note.isArchived);
    return this.isArchiveNotesPresent;
  }

  deleteNote(event: Event, id: number) {
    event.stopPropagation();
    this.noteService.deleteNote(id).subscribe(updatedNotes => {
      this.notes = updatedNotes;
      this.selectedNote = null;

    });

  }

}
