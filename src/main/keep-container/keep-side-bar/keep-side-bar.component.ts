import { Component } from '@angular/core';
import { KeepService } from "../../Service/keep.service";
import { NavigationBarComponent } from "../../navigation-bar/navigation-bar.component";
import { NoteService } from "../../Service/note.service";

@Component({
  selector: 'app-keep-side-bar',
  templateUrl: './keep-side-bar.component.html',
  styleUrls: ['./keep-side-bar.component.scss']
})
export class KeepSideBarComponent {

  constructor(private keepService: KeepService, private noteService: NoteService) {
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
