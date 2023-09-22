import {Component, OnInit} from '@angular/core';
import {NoteService} from '../../../Service/note.service';
import {defaultIfEmpty, map, Observable, of, switchMap, take} from 'rxjs';
import {Note} from "../../../Data Types/Note";


@Component({
  selector: 'app-keep-notes-archive',
  templateUrl: './keep-notes-archive.component.html',
  styleUrls: ['./keep-notes-archive.component.scss'],
})
export class KeepNotesArchiveComponent implements OnInit {
  notes$: Observable<Note[]>;
  selectedNote: Note | null = null; // Initialize as null
  constructor(private noteService: NoteService) {
    this.notes$ = this.noteService.getNotes();
  }

  ngOnInit(): void {
    this.notes$ = this.noteService.getNotes(); // Subscribe to the observable

    this.notes$.subscribe((notes) => {
      if (Array.isArray(notes)) {
        this.notes$ = new Observable((observer) => {
          observer.next(notes.reverse());
          observer.complete();
        });
      }
    });
  }

  selectNoteForEditing(note: Note) {
    this.selectedNote = note;
    this.notes$ = this.notes$.pipe(
      map((notes) =>
        notes.map((n) => ({
          ...n,
          isHidden: n.id === note.id ? !note.isMoreIconClicked : false
        }))
      )
    );
  }
  hasNotes() {

    return this.notes$.pipe(
      map((notes) => notes.length),
      defaultIfEmpty(0)
    );

  }
  handleMoreIconClick(event: MouseEvent, note: Note) {
    note.showDropdown = !note.showDropdown;
    event.stopPropagation();
    note.isMoreIconClicked = !note.isMoreIconClicked;
  }

  closeEditor(note: Note) {
    this.saveNoteChanges();
    this.notes$=of(this.noteService.changeHiddenStatus(note.id));
    this.selectedNote = null;
  }
  saveNoteChanges() {
    this.selectedNote = this.noteService.updateNote(this.selectedNote);
  }
  UnArchiveNote(id: number) {
    this.notes$ = of(this.noteService.unArchiveNote(id)).pipe(
      switchMap((currentNotes) => {
        return this.noteService.getNotes();
      })
    );

  }
  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reset the height to auto
    textarea.style.height = textarea.scrollHeight + 'px'; // Set the height to match the content's scrollHeight

  }
  checkArchive(): Observable<boolean> {
    return this.notes$.pipe(
      map((notes) => notes.some((note) => note.isArchived))
    );
  }
  convertNewlinesToBreaks(text: string): string {
    return text.replace(/\n/g, '<br>');
  }
  deleteNote(event: Event,id: number) {
    event.stopPropagation();
    this.noteService.deleteNote(id).subscribe((updatedNotes) => {
      this.notes$ = of(updatedNotes);
    });
  }
}
