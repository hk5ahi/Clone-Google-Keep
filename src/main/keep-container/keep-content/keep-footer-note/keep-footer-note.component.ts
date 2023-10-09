import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Note } from "../../../Data Types/Note";
import { Observable, of, switchMap } from "rxjs";
import { NoteService } from "../../../Service/note.service";
import { FooterService } from "../../../Service/footer.service";

@Component({
  selector: 'app-keep-footer-note',
  templateUrl: './keep-footer-note.component.html',
  styleUrls: ['./keep-footer-note.component.scss']
})
export class KeepFooterNoteComponent {

  @Input() note!: Note;
  @Input() isArchiveNotePresent: boolean = false;
  @Input() title!: string;
  @Input() noteMessage!: string;
  @Input() selectedNote!: Note | null;
  @Input() showFirstForm!: boolean;
  @Input() searchLabelText!: string;
  @Input() calledFromAddNote: boolean = false;
  @Input() calledFromNote!: boolean;
  @Input() calledFromEditorNote!: boolean;
  @Output() closeModal = new EventEmitter<boolean>();
  @Output() addAndArchiveClicked: EventEmitter<boolean> = new EventEmitter();
  notes$: Observable<Note[]>;


  constructor(private noteService: NoteService, private footerService: FooterService) {
    this.notes$ = this.noteService.getNotes();

  }

  isLabelsExist(note: Note): boolean {
    return note.labels.length > 0;
  }

  archiveNote(id: number,event: MouseEvent) {
    event.stopPropagation();
    this.notes$ = of(this.noteService.archiveNote(id)).pipe(switchMap(() => {
      return this.noteService.getNotes();
    }));
    this.selectedNote = null;
    this.closeModal.emit(true);
  }

  handleMoreIconClick(event: MouseEvent, note: Note) {

    this.noteService.closeDropdownsExceptThisNote(note);
    note.showDropdown = !note.showDropdown;
    if (note.showLabelDropdown) {
      note.showLabelDropdown = !note.showLabelDropdown;
      this.footerService.setSearchLabel('');
    }
    event.stopPropagation();
  }

  stopEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  UnArchiveNote(id: number) {
    this.notes$ = of(this.noteService.unArchiveNote(id)).pipe(switchMap((currentNotes) => {
      return this.noteService.getNotes();
    }));
    this.selectedNote = null;
    this.closeModal.emit(true);
  }

  addAndArchiveNote(title: string, message: string) {

    this.noteService.addAndArchive(title, message);
    this.addAndArchiveClicked.emit(true);
    this.title = '';
    this.noteMessage = '';
    this.footerService.setShowFirstForm(true);

  };

  toggleDropdownMenu() {

    this.footerService.toggleDropdownMenu();
  }

  closeEditor() {
    this.closeModal.emit(true);
  }
}
