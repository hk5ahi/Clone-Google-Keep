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
    this.notes$ = this.noteService.getNotes();
    this.notes$.subscribe((notes) => {
      if (Array.isArray(notes)) {
        this.notes$ = new Observable((observer) => {
          observer.next(notes);
          observer.complete();
        });
      }
    });
  }

  hasNotes() {
    return this.notes$.pipe(
      map((notes) => notes.length),
      defaultIfEmpty(0)
    );
  }

  checkArchive(): Observable<boolean> {
    return this.notes$.pipe(
      map((notes) => notes.some((note) => note.isArchived))
    );
  }
}
