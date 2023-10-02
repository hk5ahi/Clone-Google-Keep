import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Note } from "../../../Data Types/Note";
import { Observable, of, Subscription, switchMap } from "rxjs";
import { NoteService } from "../../../Service/note.service";
import { KeepCommonNoteComponent } from "../keep-common-note/keep-common-note.component";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Label } from "../../../Data Types/Label";
import { LabelService } from "../../../Service/label.service";

@Component({
  selector: 'app-keep-common-editor',
  templateUrl: './keep-common-editor.component.html',
  styleUrls: ['./keep-common-editor.component.scss'],

})
export class KeepCommonEditorComponent implements OnInit {

  @Input() selectedNote!: Note | null; // Initialize as null
  notes$: Observable<Note[]>;
  labels: Label[] = [];
  private labelListSubscription!: Subscription;
  searchLabelText: string = '';
  @ViewChild('formContainer') formContainer!: ElementRef;

  handleMoreIconClick(event: MouseEvent, note: Note) {
    event.stopPropagation();
    note.showSelectedDropdown = !note.showSelectedDropdown;
    note.isMoreIconClicked = !note.isMoreIconClicked;
    note.showSelectedLabelDropdown = false;

  }

  hasLabels(note: Note) {
    this.labelListSubscription = this.labelService.labelList$.subscribe((labels: Label[]) => {
      this.labels = labels;
    });
    return note.labels.length > 0;
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    Note: Note,
    dialogBoxOpen: boolean
  }, public dialogRef: MatDialogRef<KeepCommonEditorComponent>, private noteService: NoteService, public dialog: MatDialog, private keepCommonNoteComponent: KeepCommonNoteComponent, private labelService: LabelService) {
    this.notes$ = this.noteService.getNotes();
  }

  showLabelDropdown(event: Event, note: Note) {
    event.stopPropagation();
    note.showSelectedDropdown = !note.showSelectedDropdown;
    note.showSelectedLabelDropdown = !note.showSelectedLabelDropdown;
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
    this.dialogRef
      .afterClosed()
      .subscribe((result) => {
        this.data.Note.showSelectedLabelDropdown = false;
        this.data.Note.showSelectedDropdown = false;
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

  closeEditor(note: Note) {

    this.saveNoteChanges();
    this.notes$ = of(this.noteService.changeHiddenStatus(note.id, false));
    this.notes$ = this.noteService.getNotes();
    this.keepCommonNoteComponent.selectedNote = null;
    this.selectedNote = null;
    this.data.dialogBoxOpen = false;
    this.dialogRef.close();
  }

  isLabelsExist(note: Note): boolean {
    return note.labels.length > 0;
  }

  onMouseEnter(label: Label) {
    label.showCrossIcon = true;
  }

  onMouseLeave(label: Label) {
    label.showCrossIcon = false;
  }

  removeLabel(note: Note, label: Label, event: Event) {
    event.stopPropagation();
    this.noteService.removeLabel(note, label);
  }
}
