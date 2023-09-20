import { Component } from '@angular/core';
import { More } from "../../../Constants";

@Component({
  selector: 'app-keep-add-notes',
  templateUrl: './keep-add-notes.component.html',
  styleUrls: ['./keep-add-notes.component.scss']
})
export class KeepAddNotesComponent {
  showSecondForm = false;

  toggleSecondForm() {
    this.showSecondForm = !this.showSecondForm;
  }

  protected readonly More = More;
}
