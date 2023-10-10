import { Component, Input } from '@angular/core';
import { Label } from "../../../Data Types/Label";
import { Note } from "../../../Data Types/Note";
import { NoteService } from "../../../Service/note.service";
import { AppConstants } from "../../../Constants/app-constant";

@Component({
  selector: 'app-keep-store-labels',
  templateUrl: './keep-store-labels.component.html',
  styleUrls: ['./keep-store-labels.component.scss']
})
export class KeepStoreLabelsComponent {
  @Input() note!: Note;
  @Input() ModalOpen!: boolean;
  labelText!: string;
  constructor(private noteService: NoteService) {
  }

  toggleCrossIcon(label: Label, isMouseEnter: boolean) {
    label.showCrossIcon = isMouseEnter;

    if (isMouseEnter) {
      this.labelText = label.text;
      const threshold = AppConstants.labelCharacterLimit;

      if (label.text.length >= threshold && label.text.length <= AppConstants.maximumLabelCharacterLimit) {
        label.text = label.text.substring(0, 2) + "...";
      } else if (label.text.length > AppConstants.maximumLabelCharacterLimit) {
        label.text = label.text.substring(0, label.text.length - threshold) + "...";
      }
    } else {
      label.text = this.labelText;
    }
  }

  removeLabel(note: Note, label: Label, event: Event) {
    event.stopPropagation();
    this.noteService.removeLabel(note, label);
    note.showLabelDropdown = false;
    note.showDropdown = false;
  }

  isLabelsExist(): boolean {
    return this.note.labels.length > 0;
  }

  getLabels() {
    if (this.ModalOpen) {
      return this.note.labels;
    } else {
      return this.note.labels.slice(0, 2);
    }
  }

  stopEvent(event: MouseEvent) {
    event.stopPropagation();
  }
}
