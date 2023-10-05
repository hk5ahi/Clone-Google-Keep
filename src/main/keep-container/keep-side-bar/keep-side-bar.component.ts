import { Component } from '@angular/core';
import { HeaderService } from "../../Service/header.service";
import { NoteService } from "../../Service/note.service";

@Component({
  selector: 'app-keep-side-bar',
  templateUrl: './keep-side-bar.component.html',
  styleUrls: ['./keep-side-bar.component.scss']
})
export class KeepSideBarComponent {

  isNoteSelected: boolean = true;
  isArchiveSelected: boolean = false;

  constructor(private headerService: HeaderService, private noteService: NoteService) {
  }

  updateIsNotes() {
    this.headerService.updateIsNotes();
    this.noteService.setSearchedData('');
    this.isNoteSelected = true;
    this.isArchiveSelected = false;
  }

  updateIsArchive() {
    this.headerService.updateIsArchive();
    this.noteService.setSearchedData('');
    this.isArchiveSelected = true;
    this.isNoteSelected = false;
  }

}
