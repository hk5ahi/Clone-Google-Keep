import { Component, Input } from '@angular/core';
import { Label } from "../../../Data Types/Label";
import { Note } from "../../../Data Types/Note";
import { NoteService } from "../../../Service/note.service";

@Component({
    selector: 'app-keep-store-labels',
    templateUrl: './keep-store-labels.component.html',
    styleUrls: ['./keep-store-labels.component.scss']
})
export class KeepStoreLabelsComponent {
    @Input() note!: Note;
    @Input() ModalOpen!: boolean;

    constructor(private noteService: NoteService) {
    }

    toggleCrossIcon(label: Label, isMouseEnter: boolean) {
        label.showCrossIcon = isMouseEnter;
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

}
