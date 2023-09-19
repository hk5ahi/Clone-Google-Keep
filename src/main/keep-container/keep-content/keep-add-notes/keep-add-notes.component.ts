import {Component, ElementRef, HostListener} from '@angular/core';
import {NoteService} from "../../../Service/note.service";


@Component({
  selector: 'app-keep-add-notes',
  templateUrl: './keep-add-notes.component.html',
  styleUrls: ['./keep-add-notes.component.scss'],

})
export class KeepAddNotesComponent {
  showFirstForm: boolean = true;
  showDropdownMenu: boolean = false;
  title: string = '';
  noteMessage: string = '';

  constructor( private elementRef: ElementRef,private noteService: NoteService) {}
  toggleDropdownMenu() {
    this.showDropdownMenu = !this.showDropdownMenu;
  }

  toggleForms() {
    this.showFirstForm = !this.showFirstForm; // Open the first form
    this.showDropdownMenu = false; // Close the dropdown menu
    this.addNote();
  }

  addNote() {
    if(this.title!='' || this.noteMessage!='') {
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

  }



}
