import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from "rxjs";
import { Note } from "../../../Data Types/Note";
import { NoteService } from "../../../Service/note.service";
import { MatDialog } from "@angular/material/dialog";
import { KeepCommonEditorComponent } from "../keep-common-editor/keep-common-editor.component";
import { Label } from "../../../Data Types/Label";
import { FooterService } from "../../../Service/footer.service";

@Component({

  selector: 'app-keep-common-note',
  styleUrls: ['./keep-common-note.component.scss'],
  templateUrl: './keep-common-note.component.html',
})

export class KeepCommonNoteComponent implements OnInit, OnDestroy {

  @Input() isArchiveNotePresent: boolean = false;
  @Input() isSearch!: boolean;
  @ViewChild('notes') notes!: ElementRef;
  notes$: Observable<Note[]>;
  selectedNote: Note | null = null; // Initialize as null
  searchValue: string = '';
  dialogBoxOpen: boolean = false;
  labels: Label[] = [];
  searchLabelText: string = '';
  private labelListSubscription!: Subscription;


  constructor(public dialog: MatDialog, private noteService: NoteService, private footerService: FooterService) {
    this.notes$ = this.noteService.getNotes();
    this.labelListSubscription = this.noteService.getLabels().subscribe((labels: Label[]) => {
      this.labels = labels;
    });
  }

  ngOnInit(): void {
    this.subscribeToSearchData();
  }

  isCommonNote(note: Note): boolean {
    const isNotePresent = this.noteService.filteredNotes.some(filteredNote => filteredNote.id === note.id);
    const isArchivedMatch = this.isArchiveNotePresent ? note.isArchived : !note.isArchived;
    return (this.isSearch && isNotePresent && isArchivedMatch) || (!this.isSearch && isArchivedMatch);
  }

  selectNoteForEditing(note: Note) {
    this.selectedNote = note;
    this.dialogBoxOpen = true;
    note.showLabelDropdown = false;
    note.showDropdown = false;
    this.openDialog();
  }

  showEmptyNoteText(note: Note): boolean {
    return !note.title.trim() && !note.content.trim() && note.labels.length == 0
  }

  formattedContent(content: string): string {
    let updateContent: string = this.convertNewlinesToBreaks(content);
    return this.highlightSearchTerm(updateContent, this.searchValue);
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

  convertNewlinesToBreaks(text: string): string {
    return text.replace(/\n/g, '<br>');
  }

  openDialog(): void {
    this.dialogBoxOpen = true;
    if (this.selectedNote) {
      this.dialog.open(KeepCommonEditorComponent, {
        data: {
          Note: this.selectedNote, dialogBoxOpen: this.dialogBoxOpen
        }
      });

      this.dialog.afterAllClosed.subscribe(() => {
        this.dialogBoxOpen = false;
        this.selectedNote = null;
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const isClickInsideNote = this.notes?.nativeElement?.contains(event.target);
    if (this.notes && !isClickInsideNote) {
      this.closeDropdowns();
    }
  }

  // Purpose: Unsubscribe the subscription to avoid memory leak.
  ngOnDestroy(): void {
    if (this.labelListSubscription) {
      this.labelListSubscription.unsubscribe();
    }
  }

  private closeDropdowns(): void {
    this.notes$.forEach((notes) => {
      notes.forEach((note) => {
        if (note.showDropdown) {
          note.showDropdown = false;
        } else if (note.showLabelDropdown) {
          note.showLabelDropdown = false;
          this.footerService.setSearchLabel('');
        }
      });
    });
  }

  private subscribeToSearchData(): void {
    this.noteService.getSearchedData().subscribe((searchData) => {
      this.searchValue = searchData;
    });
  }
}


