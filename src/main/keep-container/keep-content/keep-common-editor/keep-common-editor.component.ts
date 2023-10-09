import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Note } from "../../../Data Types/Note";
import { Observable, Subscription } from "rxjs";
import { NoteService } from "../../../Service/note.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Label } from "../../../Data Types/Label";
import { animate, style, transition, trigger } from "@angular/animations";
import { AppConstants } from "../../../Constants/app-constant";


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
  @ViewChild('noteText') noteText!: ElementRef;
  @ViewChild('noteTitle') noteTitle!: ElementRef;
  @ViewChild('secondForm') secondForm!: ElementRef;
  notes$: Observable<Note[]>;
  labels: Label[] = [];
  searchLabelText: string = '';
  private labelListSubscription!: Subscription;
  private notesSubscription!: Subscription;
  private dialogRefSubscription!: Subscription;
  private lastContent!: string;

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

    this.dialogRef.afterOpened().subscribe(() => {
      this.lastContent = this.data.Note.content;
      this.adjustNoteTextHeight();

      // Set focus with a delay of 100 milliseconds
      setTimeout(() => {
        this.noteText.nativeElement.focus();

      }, 1);
    });

    this.dialogRef.afterClosed().subscribe(() => {
      this.data.Note.showLabelDropdown = false;
      this.data.Note.showDropdown = false;
      this.noteService.updateNote(this.data.Note);
    });
  }

  calculateDynamicMinHeight(): { minHeight: string; top: string } {
    const formContainerHeight = this.formContainer?.nativeElement?.offsetHeight;

    if (!this.data.Note.showDropdown && !this.data.Note.showLabelDropdown) {
      return {
        minHeight: (AppConstants.modalDialoguesHeight.noMenu + formContainerHeight / 16) + 'em',
        top: AppConstants.modalDialoguesTopPosition.noMenu + 'em'
      };
    } else if (this.data.Note.showDropdown && !this.data.Note.showLabelDropdown) {
      return {
        minHeight: (AppConstants.modalDialoguesHeight.onlyMenu + formContainerHeight / 16) + 'em',
        top: AppConstants.modalDialoguesTopPosition.onlyMenu + 'em'
      };
    } else {
      return {

        minHeight: (AppConstants.modalDialoguesHeight.onlyLabel + formContainerHeight / 16) + 'em',
        top: AppConstants.modalDialoguesTopPosition.onlyLabel + 'em'
      };
    }
  }

  saveNoteChanges() {
    this.selectedNote = this.noteService.updateNote(this.data.Note);
  }

  adjustNoteTextHeight() {
    const noteTextElement = this.noteText.nativeElement;
    const newContent = this.data.Note.content;

    // Set a default height when there's no content
    const defaultHeight = AppConstants.defaultNoteHeight;
    // Reset to 'auto' to get the correct scrollHeight
    noteTextElement.style.height = 'auto';
    // Set the height directly to the scrollHeight
    const newHeight = Math.max(noteTextElement.scrollHeight, defaultHeight);
    // Use MIN_HEIGHT as a minimum
    noteTextElement.style.height = `${newHeight}px`;
    // Update lastContent
    this.lastContent = newContent;
    // Set a default height when there's no content
    if (!newContent) {
      noteTextElement.style.height = `${defaultHeight}px`;
    }
  }

  closeEditor() {
    this.saveNoteChanges();
    this.selectedNote = null;
    this.data.dialogBoxOpen = false;
    this.dialogRef.close();
  }

  checkFormHeight() {
    return this.formContainer?.nativeElement.offsetHeight >= 543;
  }

  // Purpose: Unsubscribe the subscription to avoid memory leak.
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
