import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { NoteService } from "../../../Service/note.service";


@Component({
    selector: 'app-keep-add-notes',
    templateUrl: './keep-add-notes.component.html',
    styleUrls: ['./keep-add-notes.component.scss'],


})
export class KeepAddNotesComponent {
    @ViewChild('titleInput', {static: false}) titleInput!: ElementRef;
    @ViewChild('secondForm') secondFormElement!: ElementRef;
    showFirstForm: boolean = true;
    showDropdownMenu: boolean = false;
    title: string = '';
    noteMessage: string = '';
    private clickCounter: number = 0;

    constructor(private noteService: NoteService) {
    }

    toggleDropdownMenu() {
        this.showDropdownMenu = !this.showDropdownMenu;
    }

    toggleForms() {

        this.showFirstForm = !this.showFirstForm; // Open the first form
        this.showDropdownMenu = false;
        this.addNote();
    }

    addNote() {
        if (this.title != '' || this.noteMessage != '') {
            this.noteService.addNote(this.title, this.noteMessage);
            this.title = '';
            this.noteMessage = '';
        }
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        if (this.secondFormElement) {
            const isClickInsideSecondForm = this.secondFormElement.nativeElement.contains(event.target);

            if (!isClickInsideSecondForm) {
                if (this.clickCounter % 2 !== 0) {
                    // Toggle showFirstForm on alternate clicks
                    this.showFirstForm = !this.showFirstForm;
                    this.addNote();
                }
                this.clickCounter++;
            }
        }
    }

    adjustTextareaHeight(event: Event): void {
        const textarea = event.target as HTMLTextAreaElement;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    addAndArchiveNote(title: string, message: string) {
        this.noteService.addAndArchive(title, message);
        this.title = '';
        this.noteMessage = '';
        this.showFirstForm = true;
    };

    focusTextarea(event: Event) {
        event.preventDefault();
        this.titleInput.nativeElement.blur();
        const textarea = document.querySelector('.note-text') as HTMLTextAreaElement;
        textarea.focus();
    }
}
