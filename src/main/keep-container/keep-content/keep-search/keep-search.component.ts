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
  selectedArchiveNote: Note | null = null;
  searchValue: string = '';

  ngOnInit(): void {
    this.noteService.getNotes().subscribe((notes) => {
      this.notes = notes;
    });
    this.noteService.getSearchedData().subscribe((searchData) => {
      this.searchValue = searchData;
    });
  }
  convertNewlinesToBreaks(text: string): string {
    return text.replace(/\n/g, '<br>');
  }
  highlightSearchTerm(text: string, searchTerm: string): string {
    if (!searchTerm) {
      return text;
    }
    const regex = new RegExp(searchTerm, 'gi');

    return text.replace(regex, (match) => {
      return `<span class="highlight">${match}</span>`;
    });
  }
  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reset the height to auto
    textarea.style.height = textarea.scrollHeight + 'px'; // Set the height to match the content's scrollHeight

  }
  formattedContent(content: string): string {
    let updateContent:string=this.convertNewlinesToBreaks(content);
    return this.highlightSearchTerm(updateContent, this.searchValue);
  }
  isNotesSimpleAndArchive(): boolean {
    return this.noteService.isNotesSimpleAndArchive();
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

  unArchiveNote(id: number) {
    this.notes = this.noteService.unArchiveNote(id);
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
  selectArchiveNoteForEditing(note: Note) {
    this.selectedArchiveNote = note;
    console.log(this.selectedArchiveNote);
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
  closeArchiveEditor(note: Note) {
    this.saveNoteChanges();
    this.selectedArchiveNote = null;
    note.isHidden = false;
  }
}
