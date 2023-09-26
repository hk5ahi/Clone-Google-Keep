import { Component } from '@angular/core';
import { KeepService } from "../../Service/keep.service";
import { NavigationBarComponent } from "../../navigation-bar/navigation-bar.component";
import { NoteService } from "../../Service/note.service";
import { MatDialog } from "@angular/material/dialog";
import { KeepCommonEditorComponent } from "../keep-content/keep-common-editor/keep-common-editor.component";
import { KeepLabelModalComponent } from "../keep-content/keep-label-modal/keep-label-modal.component";

@Component({
  selector: 'app-keep-side-bar',
  templateUrl: './keep-side-bar.component.html',
  styleUrls: ['./keep-side-bar.component.scss']
})
export class KeepSideBarComponent {

  constructor(public dialog: MatDialog,private keepService: KeepService, private noteService: NoteService) {
  }

  openLabelModal() {
    this.openDialog();
  }

  openDialog(): void {


      this.dialog.open(KeepLabelModalComponent, {

      });
      this.dialog.afterAllClosed.subscribe(() => {});
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
