import { Component, ElementRef, HostListener, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Note } from "../../../Data Types/Note";
import { Observable, of, switchMap } from "rxjs";
import { NoteService } from "../../../Service/note.service";
import { KeepCommonNoteComponent } from "../keep-common-note/keep-common-note.component";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-keep-common-editor',
  templateUrl: './keep-common-editor.component.html',
  styleUrls: ['./keep-common-editor.component.scss'],

})
export class KeepCommonEditorComponent implements OnInit {

  @Input() selectedNote!: Note | null; // Initialize as null
  notes$: Observable<Note[]>;
  @ViewChild('formContainer') formContainer!: ElementRef;

  handleMoreIconClick(event: MouseEvent, note: Note) {
    note.showDropdown = !note.showDropdown;
    event.stopPropagation();
    note.isMoreIconClicked = !note.isMoreIconClicked;
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    Note: Note,
    dialogBoxOpen: boolean
  }, public dialogRef: MatDialogRef<KeepCommonEditorComponent>, private noteService: NoteService, private keepCommonNoteComponent: KeepCommonNoteComponent) {
    this.notes$ = this.noteService.getNotes();
  }

  ngOnInit(): void {
    this.notes$ = this.noteService.getNotes();
    this.notes$.subscribe((notes) => {
      if (Array.isArray(notes)) {
        this.notes$ = new Observable((observer) => {
          observer.next(notes);
          observer.complete();
        });
      }
    });
  }

  saveNoteChanges() {
    this.selectedNote = this.noteService.updateNote(this.data.Note);
  }

  UnArchiveNote(id: number) {

    this.notes$ = of(this.noteService.unArchiveNote(id));
    this.closeEditor(this.data.Note);
    this.selectedNote = null;
  }

  archiveNote(id: number) {
    this.notes$ = of(this.noteService.archiveNote(id)).pipe(
      switchMap((currentNotes) => {
        console.log(this.noteService.getNotes());
        return this.noteService.getNotes();
      })
    );
    this.closeEditor(this.data.Note);
    this.selectedNote = null;
  }

  deleteNote(event: Event, id: number) {
    event.stopPropagation();
    this.noteService.deleteNote(id).subscribe((updatedNotes) => {
      this.notes$ = of(updatedNotes);
    });
    this.closeEditor(this.data.Note);
    this.selectedNote = null;
  }

  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';

  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.formContainer.nativeElement.contains(event.target) && this.selectedNote) {
      this.data.Note.isHidden = false;
      console.log(this.data.Note);
      this.closeEditor(this.data.Note);
    }
    if (this.data.dialogBoxOpen) {
      this.data.Note.isHidden = true;
    }


  }

  closeEditor(note: Note) {

    this.saveNoteChanges();
    this.notes$ = of(this.noteService.changeHiddenStatus(note.id, false));
    this.notes$ = this.noteService.getNotes();
    this.keepCommonNoteComponent.selectedNote = null;
    this.selectedNote = null;
    this.data.dialogBoxOpen = false;
    this.dialogRef.close();

  }
}
