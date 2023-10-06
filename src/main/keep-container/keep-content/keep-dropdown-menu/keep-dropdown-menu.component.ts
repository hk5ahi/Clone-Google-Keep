import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Note } from "../../../Data Types/Note";
import { Label } from "../../../Data Types/Label";
import { Observable, of, Subscription } from "rxjs";
import { NoteService } from "../../../Service/note.service";
import { LabelService } from "../../../Service/label.service";


@Component({
  selector: 'app-keep-dropdown-menu',
  templateUrl: './keep-dropdown-menu.component.html',
  styleUrls: ['./keep-dropdown-menu.component.scss'],
})

export class KeepDropdownMenuComponent implements OnInit, OnDestroy {
  @Input() note!: Note;
  @Input() selectedNote!: Note | null;
  @Input() OpenDialogue!: boolean;
  @Input() isArchiveNotePresent!: boolean;
  @Output() closeModal = new EventEmitter<boolean>();
  notes$: Observable<Note[]>;
  labels: Label[] = [];
  private labelListSubscription!: Subscription;
  private notesSubscription!: Subscription;


  constructor(private noteService: NoteService, private labelService: LabelService) {
    this.labelListSubscription = this.noteService.getLabels().subscribe((labels: Label[]) => {
      this.labels = labels;
    });
    this.notes$ = this.noteService.getNotes();

  }

  ngOnInit(): void {
    this.subscribeToNotesAndHandleArray(this.notes$);
    this.noteService.closeDropdownsExceptThisNote(this.note);
  }

  hasLabels(note: Note) {
    this.labelListSubscription = this.labelService.labelList$.subscribe((labels: Label[]) => {
      this.labels = labels;
    });
    return note.labels.length > 0;
  }

  deleteNote(event: Event, id: number) {
    event.stopPropagation();
    this.noteService.deleteNote(id).subscribe((updatedNotes) => {
      this.notes$ = of(updatedNotes);
    });
    this.closeModal.emit(true);
  }

  showLabelDropdown(event: Event, note: Note) {
    event.stopPropagation();
    note.showDropdown = !note.showDropdown;
    note.showLabelDropdown = !note.showLabelDropdown;
  }

  showDropDown() {
    return (!this.OpenDialogue && this.note.showDropdown && !this.selectedNote) || (this.note.showDropdown && this.OpenDialogue)
  }
  // Changed the variable names to make it more readable.
  private subscribeToNotesAndHandleArray(notes$: Observable<any>): void {
    this.notesSubscription = notes$.subscribe((receivedNotes) => {
      if (Array.isArray(receivedNotes)) {
        this.notes$ = new Observable((notesObserver) => {
          notesObserver.next(receivedNotes);
          notesObserver.complete();
        });
      }
    });
  }
  // Purpose: Unsubscribe the subscription to avoid memory leak.
  ngOnDestroy(): void {
    if (this.labelListSubscription) {
      this.labelListSubscription.unsubscribe();
    }
    if (this.notesSubscription) {
      this.notesSubscription.unsubscribe();
    }
  }

}
