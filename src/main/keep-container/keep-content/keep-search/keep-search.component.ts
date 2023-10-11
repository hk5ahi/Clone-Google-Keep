import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Note } from "../../../Data Types/Note";
import { NoteService } from "../../../Service/note.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-keep-search',
  templateUrl: './keep-search.component.html',
  styleUrls: ['./keep-search.component.scss']
})
export class KeepSearchComponent implements OnInit, OnDestroy {
  @Input() isSearch!: boolean;
  notes: Note[] = [];
  searchValue: string = '';
  private notesSubscription!: Subscription;
  private searchDataSubscription!: Subscription;

  constructor(private noteService: NoteService) {
  }

  ngOnInit(): void {
    this.notesSubscription = this.noteService.getNotes().subscribe((notes) => {
      this.notes = notes;
    });

    this.searchDataSubscription = this.noteService.getSearchedData().subscribe((searchData) => {
      this.searchValue = searchData;
    });
  }

  isNotesSimpleAndArchive(): boolean {
    return this.noteService.isNotesSimpleAndArchive();
  }

  isMatchedNotes(): boolean {
    return this.noteService.filteredNotes.length > 0;
  }

  // Purpose: Unsubscribe the subscription to avoid memory leak.
  ngOnDestroy(): void {
    if (this.notesSubscription) {
      this.notesSubscription.unsubscribe();
    }
    if (this.searchDataSubscription) {
      this.searchDataSubscription.unsubscribe();
    }
  }

}
