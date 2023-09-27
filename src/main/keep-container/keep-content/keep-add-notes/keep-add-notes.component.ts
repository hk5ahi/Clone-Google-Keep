import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { NoteService } from "../../../Service/note.service";

@Component({
  selector: 'app-keep-add-notes',
  templateUrl: './keep-add-notes.component.html',
  styleUrls: ['./keep-add-notes.component.scss'],

})
export class KeepAddNotesComponent {
  showFirstForm: boolean = true;
  showSecondForm: boolean = false;
  showDropdownMenu: boolean = false;
  title: string = '';
  noteMessage: string = '';
  @ViewChild('titleInput', {static: false}) titleInput!: ElementRef;
  @ViewChild('secondForm') secondFormElement!: ElementRef;
  @ViewChild('firstForm') firstFormElement!: ElementRef;
  @ViewChild('form') FormElement!: ElementRef;
  @ViewChild('textarea') Text!: ElementRef;

  constructor(private elementRef: ElementRef, private noteService: NoteService) {
  }

  toggleDropdownMenu() {
    this.showDropdownMenu = !this.showDropdownMenu;
  }

  openSecondForm() {
    this.showFirstForm = false; // Open the first form
    this.showSecondForm = true; // Open the second form
    this.showDropdownMenu = false; // Close the dropdown menu
    this.addNote();
  }

  openFirstForm() {
    this.showFirstForm = true; // Open the first form
    this.showSecondForm = false; // Open the second form
    this.showDropdownMenu = false; // Close the dropdown menu
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
    if (!this.elementRef.nativeElement.contains(event.target) && this.showDropdownMenu) {

      this.showDropdownMenu = false;
      this.showFirstForm = true;
    }
    if (this.showSecondForm && (this.elementRef.nativeElement.contains(event.target) || (this.FormElement && this.FormElement.nativeElement.contains(event.target)) || (this.Text && this.Text.nativeElement.contains(event.target))) && (this.secondFormElement && !this.secondFormElement.nativeElement.contains(event.target))) {
      this.showFirstForm = true;
      this.showSecondForm = false;
      this.addNote();
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

  focusTextarea() {
    this.titleInput.nativeElement.blur();
    setTimeout(() => {
      const textarea = document.querySelector('.note-text') as HTMLTextAreaElement;
      textarea.focus();
    }, 0);
  }

}
