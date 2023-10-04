import { Component, Input, OnInit } from '@angular/core';
import { Note } from "../../../Data Types/Note";
import { NoteService } from "../../../Service/note.service";

@Component({
    selector: 'app-keep-search',
    templateUrl: './keep-search.component.html',
    styleUrls: ['./keep-search.component.scss']
})
export class KeepSearchComponent implements OnInit {
    @Input() isSearch: boolean = false;
    notes: Note[] = [];
    searchValue: string = '';

    constructor(private noteService: NoteService) {
    }

    ngOnInit(): void {
        this.noteService.getNotes().subscribe((notes) => {
            this.notes = notes;
        });
        this.noteService.getSearchedData().subscribe((searchData) => {
            this.searchValue = searchData;
        });
    }

    isNotesSimpleAndArchive(): boolean {
        return this.noteService.isNotesSimpleAndArchive();
    }

    isMatchedNotes(): boolean {
        return this.noteService.filteredNotes.length == 0;
    }

    hasNotes(): boolean {
        return this.notes.length > 0;
    }

}
