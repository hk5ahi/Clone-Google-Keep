import {Component, OnInit} from '@angular/core';
import {NoteService} from '../../../Service/note.service';
import {defaultIfEmpty, map, Observable, of, switchMap} from 'rxjs';
import {Note} from "../../../Data Types/Note";


@Component({
  selector: 'app-keep-notes-archive',
  templateUrl: './keep-notes-archive.component.html',
  styleUrls: ['./keep-notes-archive.component.scss'],
})
export class KeepNotesArchiveComponent implements OnInit {
  notes$: Observable<Note[]>;

  constructor(private noteService: NoteService) {
    this.notes$ = this.noteService.getNotes();
  }

  ngOnInit(): void {
    this.notes$ = this.noteService.getNotes(); // Subscribe to the observable
  }

  showDropdownMenu: boolean = false;


  toggleDropdownMenu(note: Note) {
    // Toggle the showDropdown property for the clicked note
    note.showDropdown = !note.showDropdown;
  }
  hasNotes() {

    return this.notes$.pipe(
      map((notes) => notes.length),

      defaultIfEmpty(0)
    );

  }

  UnArchiveNote(id: number) {

    this.notes$ = of(this.noteService.unArchiveNote(id)).pipe(
      switchMap((currentNotes) => {
        return this.noteService.getNotes();
      })
    );
  }
  checkArchive(): Observable<boolean> {
    return this.notes$.pipe(
      map((notes) => notes.some((note) => note.isArchived))
    );
  }

  deleteNote(id: number) {
    this.noteService.deleteNote(id).subscribe((updatedNotes) => {
      this.notes$ = of(updatedNotes);
    });
  }


}
