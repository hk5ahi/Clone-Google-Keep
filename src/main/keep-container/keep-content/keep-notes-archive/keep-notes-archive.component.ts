import { Component, OnInit } from '@angular/core';
import { NoteService } from '../../../Service/note.service';
import { defaultIfEmpty, map, Observable } from 'rxjs';
import { Note } from "../../../Data Types/Note";

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

  toggleDropdownMenu() {
    this.showDropdownMenu = !this.showDropdownMenu;
  }

  hasNotes() {

    return this.notes$.pipe(
      map((notes) => notes.length),

      defaultIfEmpty(0)
    );

  }

  UnArchiveNote(title: string) {
    // Implement your archiving logic here using the NoteService
  }
}
