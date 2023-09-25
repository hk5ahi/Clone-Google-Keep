import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NoteService } from '../../../Service/note.service';
import { Note } from "../../../Data Types/Note";
import { defaultIfEmpty, map, Observable } from "rxjs";

@Component({
  selector: 'app-keep-notes',
  templateUrl: './keep-notes.component.html',
  styleUrls: ['./keep-notes.component.scss'],
})
export class KeepNotesComponent implements OnInit {
  notes$: Observable<Note[]>;

  constructor(private noteService: NoteService, private elementRef: ElementRef) {
    this.notes$ = this.noteService.getNotes();
  }

  hasNotes() {
    return this.notes$.pipe(
      map((notes) => notes.length),
      defaultIfEmpty(0)
    );

  }

  ngOnInit(): void {
    this.notes$ = this.noteService.getNotes(); // Subscribe to the observable

    this.notes$.subscribe((notes) => {
      if (Array.isArray(notes)) {
        this.notes$ = new Observable((observer) => {
          observer.next(notes);
          observer.complete();
        });
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.notes$.subscribe((notes) => {
        notes.forEach((note) => {
          note.showDropdown = false;
        });
      });
    }
  }

  isArchiveNotes(): Observable<boolean> {
    return this.notes$.pipe(
      map(notes => notes.every(note => note.isArchived))
    );
  }
}
