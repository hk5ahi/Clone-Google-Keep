import { Component, Input } from '@angular/core';
import { Note } from "../../../Data Types/Note";
import { Label } from "../../../Data Types/Label";
import { LabelService } from "../../../Service/label.service";
import { NoteService } from "../../../Service/note.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-keep-label-dropdown',
  templateUrl: './keep-label-dropdown.component.html',
  styleUrls: ['./keep-label-dropdown.component.scss']
})
export class KeepLabelDropdownComponent {

  @Input() note!: Note;
  labels: Label[] = [];
  private labelListSubscription!: Subscription;
  @ Input() searchLabelText: string = '';
  addLabelIndicator: boolean = false;
  @Input() labelDropdown: boolean = false;
  @Input() DialogBoxOpen: boolean = false;

  constructor(private labelService: LabelService, private noteService: NoteService) {
    this.labelListSubscription = this.noteService.getLabels().subscribe((labels: Label[]) => {
      this.labels = labels;
    });
  }

  isLabelsExist(note: Note): boolean {
    return note.labels.length > 0;
  }

  checkSearchText() {
    if (this.searchLabelText != '') {
      this.addLabelIndicator = true;
    } else if (this.searchLabelText == '') {
      this.addLabelIndicator = false;
    }
  }

  addLabel(text: string, note: Note) {
    this.labelService.addLabel(text, note);
    this.searchLabelText = '';
  }

  stopEvent(event: Event) {
    event.stopPropagation();
  }

  toggleCheckBox(note: Note, Label: Label) {
    this.noteService.toggleCheckBox(note, Label);
  }

  getCheckBox(note: Note, labelToFind: Label): boolean {
    const foundLabel = note.labels.find(label => label.id === labelToFind.id);

    if (foundLabel) {
      return foundLabel.showCheckbox;
    }
    return false;
  }

  searchLabels(searchText: string): boolean {
    return this.labelService.searchLabels(searchText);
  }
}
