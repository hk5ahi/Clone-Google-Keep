import { Component } from '@angular/core';

@Component({
  selector: 'app-keep-add-notes',
  templateUrl: './keep-add-notes.component.html',
  styleUrls: ['./keep-add-notes.component.scss']
})
export class KeepAddNotesComponent {
  showSecondForm = false;


  // Function to toggle the visibility of the second form
  toggleSecondForm() {
    this.showSecondForm = !this.showSecondForm;
  }
}
