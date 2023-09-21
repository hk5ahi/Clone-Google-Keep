import { Component, OnInit } from '@angular/core';
import { Note } from "../../../Data Types/Note";
import { NoteService } from "../../../Service/note.service";

@Component({
  selector: 'app-keep-search',
  templateUrl: './keep-search.component.html',
  styleUrls: ['./keep-search.component.scss']
})
export class KeepSearchComponent implements OnInit {
  constructor(private noteService: NoteService) {
  }

  notes: Note[] = []; // Use an array instead of an observable
  selectedNote: Note | null = null;
  searchValue: string = '';
  ngOnInit(): void {
    this.noteService.getNotes().subscribe((notes) => {
      this.notes = notes;

    });
    this.noteService.getSearchedData().subscribe((searchData) => {
      this.searchValue = searchData;

    });

  }

  isMatchedNotes(): boolean {
    return this.notes.every((note) => !note.noteExist);
  }

  deleteNote(event: Event, id: number) {
    event.stopPropagation();
    this.noteService.deleteNote(id).subscribe(() => {
      this.noteService.getNotes().subscribe((notes) => {
        this.notes = notes;
        this.selectedNote = null;
      });
    });
  }

  handleMoreIconClick(event: MouseEvent, note: Note) {
    note.showDropdown = !note.showDropdown;
    event.stopPropagation();
    note.isMoreIconClicked = !note.isMoreIconClicked;

  }

  archiveNote(id: number) {
    this.notes = this.noteService.archiveNote(id);
  }

  hasNotes(): boolean {
    return this.notes.length > 0;
  }

  selectNoteForEditing(note: Note) {
    this.selectedNote = note;
    this.notes.forEach((n) => {
      n.isHidden = false;
    });

    if (!note.isMoreIconClicked) {
      note.isHidden = true;
    }
  }

  saveNoteChanges() {
    this.selectedNote = this.noteService.updateNote(this.selectedNote);
  }

  closeEditor(note: Note) {
    this.saveNoteChanges();
    this.selectedNote = null;
    note.isHidden = false;

  }
}
