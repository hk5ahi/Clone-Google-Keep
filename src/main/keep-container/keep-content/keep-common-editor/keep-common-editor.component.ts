import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Note } from "../../../Data Types/Note";
import { Observable, Subscription } from "rxjs";
import { NoteService } from "../../../Service/note.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Label } from "../../../Data Types/Label";

import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'app-keep-common-editor',
  templateUrl: './keep-common-editor.component.html',
  styleUrls: ['./keep-common-editor.component.scss'],
  animations: [
    trigger('fadeInLeft', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateX(-100%)'}),
        animate('300ms ease-in', style({opacity: 1, transform: 'translateX(0)'})),
      ]),
    ]),
  ],

})
export class KeepCommonEditorComponent implements OnInit, OnDestroy {

  @Input() selectedNote!: Note | null;
  @ViewChild('formContainer') formContainer!: ElementRef;
  @ViewChild('secondForm') secondForm!: ElementRef;
  notes$: Observable<Note[]>;
  labels: Label[] = [];
  searchLabelText: string = '';
  private labelListSubscription!: Subscription;
  private notesSubscription!: Subscription;
  private dialogRefSubscription!: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    Note: Note,
    dialogBoxOpen: boolean
  }, public dialogRef: MatDialogRef<KeepCommonEditorComponent>, private noteService: NoteService) {
    this.notes$ = this.noteService.getNotes();

  }

  ngOnInit(): void {
    this.notes$ = this.noteService.getNotes();
    this.notesSubscription = this.notes$.subscribe((notes) => {
      if (Array.isArray(notes)) {
        this.notes$ = new Observable((observer) => {
          observer.next(notes);
          observer.complete();
        });
      }
    });

    this.dialogRefSubscription = this.dialogRef.afterClosed().subscribe(() => {
      this.data.Note.showLabelDropdown = false;
      this.data.Note.showDropdown = false;
    });
  }

  saveNoteChanges() {
    this.selectedNote = this.noteService.updateNote(this.data.Note);
  }

  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  closeEditor() {
    this.saveNoteChanges();
    this.selectedNote = null;
    this.data.dialogBoxOpen = false;
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    if (this.labelListSubscription) {
      this.labelListSubscription.unsubscribe();
    }
    if (this.notesSubscription) {
      this.notesSubscription.unsubscribe();
    }
    if (this.dialogRefSubscription) {
      this.dialogRefSubscription.unsubscribe();
    }
  }
}
