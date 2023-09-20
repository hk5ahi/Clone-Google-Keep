import { Component } from '@angular/core';
import { KeepService } from "../../Service/keep.service";

@Component({
  selector: 'app-keep-side-bar',
  templateUrl: './keep-side-bar.component.html',
  styleUrls: ['./keep-side-bar.component.scss']
})
export class KeepSideBarComponent {

  constructor(private keepService: KeepService) {
  }

  updateIsNotes() {
    this.keepService.updateIsNotes()
  }

  updateIsArchive() {
    this.keepService.updateIsArchive()
  }

}
