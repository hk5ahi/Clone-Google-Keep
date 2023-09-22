import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NoteService } from '../../../Service/note.service';
import { Note } from "../../../Data Types/Note";


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
      this.notes = notes.reverse();

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
  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reset the height to auto
    textarea.style.height = textarea.scrollHeight + 'px'; // Set the height to match the content's scrollHeight

  }
  archiveNote(id: number) {
    this.notes = this.noteService.archiveNote(id);
  }

  isArchiveNotes() {
    this.isArchiveNotesPresent = this.notes.every((note) => note.isArchived);
    return this.isArchiveNotesPresent;
  }
  convertNewlinesToBreaks(text: string): string {
    return text.replace(/\n/g, '<br>');
  }
  deleteNote(event: Event, id: number) {
    event.stopPropagation();
    this.noteService.deleteNote(id).subscribe(updatedNotes => {
      this.notes = updatedNotes;
      this.selectedNote = null;
    });
  }

}
