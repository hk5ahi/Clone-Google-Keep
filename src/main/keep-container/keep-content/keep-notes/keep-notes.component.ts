import { Component, OnDestroy, OnInit } from '@angular/core';
import { NoteService } from '../../../Service/note.service';
import { Note } from "../../../Data Types/Note";
import { defaultIfEmpty, map, Observable, Subscription } from "rxjs";

@Component({
  selector: 'app-keep-notes',
  templateUrl: './keep-notes.component.html',
  styleUrls: ['./keep-notes.component.scss'],
})
export class KeepNotesComponent implements OnInit, OnDestroy {
  notes$: Observable<Note[]>;
  private notesSubscription!: Subscription;

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

  isArchiveNotes(): Observable<boolean> {
    return this.notes$.pipe(
      map(notes => notes.every(note => note.isArchived))
    );
  }

  // Purpose: Unsubscribe the subscription to avoid memory leak.
  ngOnDestroy(): void {
    if (this.notesSubscription) {
      this.notesSubscription.unsubscribe();
    }
  }
}
