import { Component, Input, OnDestroy } from '@angular/core';
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
export class KeepLabelDropdownComponent implements OnDestroy {

    @Input() note!: Note;
    @Input() searchLabelText: string = '';
    @Input() labelDropdown: boolean = false;
    @Input() DialogBoxOpen: boolean = false;
    @Input() selectedNote!: Note | null; // Initialize as null
    labels: Label[] = [];
    private labelListSubscription!: Subscription;

    constructor(private labelService: LabelService, private noteService: NoteService) {
        this.labelListSubscription = this.noteService.getLabels().subscribe((labels: Label[]) => {
            this.labels = labels;
        });
    }

    isLabelsExist(note: Note): boolean {
        return note.labels.length > 0;
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
        return !!foundLabel;
    }

    getDynamicHeight(): string {
        const numberOfLabels = this.labels.length;
        const additionalHeight = 35.5;
        const totalHeight = (numberOfLabels * 29) + additionalHeight;
        return `${totalHeight}px`;
    }

    searchLabels(searchText: string): boolean {
        return this.labelService.searchLabels(searchText);
    }

    ngOnDestroy(): void {
        if (this.labelListSubscription) {
            this.labelListSubscription.unsubscribe();
        }
    }
}
