import { Component } from '@angular/core';
import { HeaderService } from "../../Service/header.service";
import { NoteService } from "../../Service/note.service";

@Component({
    selector: 'app-keep-side-bar',
    templateUrl: './keep-side-bar.component.html',
    styleUrls: ['./keep-side-bar.component.scss']
})
export class KeepSideBarComponent {

    constructor(private keepService: HeaderService, private noteService: NoteService) {
    }

    updateIsNotes() {
        this.keepService.updateIsNotes();
        this.noteService.setSearchedData('');
    }

    updateIsArchive() {
        this.keepService.updateIsArchive();
        this.noteService.setSearchedData('');
    }

}
