import { Component, Input, OnInit } from '@angular/core';
import { Observable, of, Subscription, switchMap } from "rxjs";
import { Note } from "../../../Data Types/Note";
import { NoteService } from "../../../Service/note.service";
import { MatDialog } from "@angular/material/dialog";
import { KeepCommonEditorComponent } from "../keep-common-editor/keep-common-editor.component";
import { animate, style, transition, trigger } from "@angular/animations";
import { LabelService } from "../../../Service/label.service";
import { Label } from "../../../Data Types/Label";


@Component({
  animations: [
    trigger('noteEnterLeave', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateX(-100%) scale(0.9)'}),
        animate('300ms ease-in', style({opacity: 1, transform: 'translateX(0) scale(1)'})),
      ]),
      transition(':leave', [
        animate('200ms ease', style({opacity: 0, transform: 'translateX(-100%) scale(0.9)'})),
      ]),
    ]),
  ],
  selector: 'app-keep-common-note',
  styleUrls: ['./keep-common-note.component.scss'],
  templateUrl: './keep-common-note.component.html',
})

export class KeepCommonNoteComponent implements OnInit {

  notes$: Observable<Note[]>;
  selectedNote: Note | null = null; // Initialize as null
  @Input() isArchiveNotePresent: boolean = false;
  @Input() isSearch: boolean = false;
  searchValue: string = '';
  dialogBoxOpen: boolean = false;
  labels: Label[] = [];
  private labelListSubscription!: Subscription;
  addLabelIndicator: boolean = false;
  searchLabelText: string = '';

  constructor(public dialog: MatDialog, private noteService: NoteService, private labelService: LabelService) {
    this.notes$ = this.noteService.getNotes();
  }

  selectNoteForEditing(note: Note) {
    this.selectedNote = note;
    this.dialogBoxOpen = true;
    note.showLabelDropdown = false;
    note.showDropdown = false;
    this.notes$ = of(this.noteService.changeHiddenStatus(note.id, true));
    this.openDialog();

  }

  addLabel(text: string, note: Note) {
    this.labelService.addLabel(text, note);

  }

  searchLabels(searchText: string): boolean {
    return this.labelService.searchLabels(searchText);
  }

  makeAllNotesVisible() {
    this.notes$ = of(this.noteService.makeAllNotesVisible());
  }

  formattedContent(content: string): string {
    let updateContent: string = this.convertNewlinesToBreaks(content);
    return this.highlightSearchTerm(updateContent, this.searchValue);
  }

  highlightSearchTerm(text: string, searchTerm: string): string {
    if (!searchTerm) {
      return text;
    }
    const regex = new RegExp(searchTerm, 'gi');
    return text.replace(regex, (match) => {
      return `<span class="highlight">${match}</span>`;
    });
  }

  handleMoreIconClick(event: MouseEvent, note: Note) {
    note.showDropdown = !note.showDropdown;
    if (note.showLabelDropdown) {
      note.showLabelDropdown = !note.showLabelDropdown;
      this.searchLabelText = '';
    }
    event.stopPropagation();
    note.isMoreIconClicked = !note.isMoreIconClicked;
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
    this.selectedNote = null;
    this.labelListSubscription = this.labelService.labelList$.subscribe((labels: Label[]) => {
      this.labels = labels;
    });
    this.noteService.getSearchedData().subscribe((searchData) => {
      this.searchValue = searchData;
    });
  }

  stopEvent(event: Event) {
    event.stopPropagation();

  }

  checkSearchText() {
    if (this.searchLabelText != '') {
      this.addLabelIndicator = true;
    } else if (this.searchLabelText == '') {
      this.addLabelIndicator = false;
    }
  }

  archiveNote(id: number) {
    this.notes$ = of(this.noteService.archiveNote(id)).pipe(
      switchMap((currentNotes) => {
        return this.noteService.getNotes();
      })
    );
    this.selectedNote = null;
  }

  hasLabels(note: Note) {

    return note.labels.length > 0;
  }

  convertNewlinesToBreaks(text: string): string {
    return text.replace(/\n/g, '<br>');
  }

  UnArchiveNote(id: number) {
    this.notes$ = of(this.noteService.unArchiveNote(id)).pipe(
      switchMap((currentNotes) => {
        return this.noteService.getNotes();
      })
    );
    this.selectedNote = null;
  }

  deleteNote(event: Event, id: number) {
    event.stopPropagation();

    this.noteService.deleteNote(id).subscribe((updatedNotes) => {
      this.notes$ = of(updatedNotes);
    });
  }

  showLabelDropdown(event: Event, note: Note) {
    event.stopPropagation();
    note.showDropdown = !note.showDropdown;
    note.showLabelDropdown = !note.showLabelDropdown;
  }


  openDialog(): void {
    this.dialogBoxOpen = true;
    if (this.selectedNote) {
      this.dialog.open(KeepCommonEditorComponent, {
        data: {Note: this.selectedNote, dialogBoxOpen: this.dialogBoxOpen},
      });
      this.dialog.afterAllClosed.subscribe(() => {
          this.dialogBoxOpen = false;
          this.makeAllNotesVisible();
        }
      );
    }

  }

}


