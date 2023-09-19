import {Component, ElementRef, HostListener, OnInit} from '@angular/core';

import {NoteService} from '../../../Service/note.service';
import {Note} from "../../../Data Types/Note";

@Component({
  selector: 'app-keep-notes',
  templateUrl: './keep-notes.component.html',
  styleUrls: ['./keep-notes.component.scss'],
})
export class KeepNotesComponent implements OnInit {
  notes: Note[] = [];
  showDropdownMenu: boolean = false;
  isArchiveNotesPresent: boolean = false;
  constructor(private noteService: NoteService, private elementRef: ElementRef) {
  }

  toggleDropdownMenu() {
    this.showDropdownMenu = !this.showDropdownMenu;
  }

  hasNotes() {

    return this.notes.length > 0;

  }

  ngOnInit(): void {
    this.noteService.getNotes().subscribe((notes) => {
      this.notes = notes;

    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {

      this.showDropdownMenu = false;


    }

  }

  archiveNote(title: string) {
    this.notes = this.noteService.archiveNote(title);
  }

  isArchiveNotes() {
    this.isArchiveNotesPresent = this.notes.some((note) => note.isArchived);
    return this.isArchiveNotesPresent;
  }

}
