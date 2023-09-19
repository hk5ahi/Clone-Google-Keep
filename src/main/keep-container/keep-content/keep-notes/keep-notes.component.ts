import {Component, ElementRef, HostListener, OnInit} from '@angular/core';

import {NoteService} from '../../../Service/note.service';
import {Note} from "../../../Data Types/Note";
import {of} from "rxjs";

@Component({
  selector: 'app-keep-notes',
  templateUrl: './keep-notes.component.html',
  styleUrls: ['./keep-notes.component.scss'],
})
export class KeepNotesComponent implements OnInit {
  notes: Note[] = [];
  // showDropdownMenu: boolean = false;
  isArchiveNotesPresent: boolean = false;
  selectedNote: Note |null = null; // Initialize as null

  constructor(private noteService: NoteService, private elementRef: ElementRef) {
  }
  selectNoteForEditing(note: Note) {
    this.selectedNote = note;
  }

  saveNoteChanges() {

    this.selectedNote=this.noteService.updateNote(this.selectedNote);

  }
closeEditor()
{
  this.saveNoteChanges();
  this.selectedNote=null;

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

  toggleDropdownMenu(note: Note) {
    // Toggle the showDropdown property for the clicked note
    note.showDropdown = !note.showDropdown;
  }
  archiveNote(id: number) {
    this.notes = this.noteService.archiveNote(id);
  }

  isArchiveNotes() {
    this.isArchiveNotesPresent = this.notes.every((note) => note.isArchived);
    return this.isArchiveNotesPresent;
  }

  deleteNote(id: number) {
    this.noteService.deleteNote(id).subscribe(updatedNotes => {
      this.notes = updatedNotes;
    });
  }


}
