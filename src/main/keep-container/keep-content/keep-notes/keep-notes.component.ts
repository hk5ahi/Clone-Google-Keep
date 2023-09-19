import {Component} from '@angular/core';
import {Note} from "../../../Data Types/Note";


@Component({
  selector: 'app-keep-notes',
  templateUrl: './keep-notes.component.html',
  styleUrls: ['./keep-notes.component.scss']
})
export class KeepNotesComponent {

  notes: Note[] = [];

  hasNotes() {
    return this.notes.length > 0;
  }


}
