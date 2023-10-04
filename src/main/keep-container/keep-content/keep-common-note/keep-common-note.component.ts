import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of, Subscription, switchMap } from "rxjs";
import { Note } from "../../../Data Types/Note";
import { NoteService } from "../../../Service/note.service";
import { MatDialog } from "@angular/material/dialog";
import { KeepCommonEditorComponent } from "../keep-common-editor/keep-common-editor.component";
import { Label } from "../../../Data Types/Label";


@Component({

    selector: 'app-keep-common-note', styleUrls: ['./keep-common-note.component.scss'], templateUrl: './keep-common-note.component.html',
})

export class KeepCommonNoteComponent implements OnInit, OnDestroy {

    @Input() isArchiveNotePresent: boolean = false;
    @Input() isSearch: boolean = false;
    @ViewChild('notes') notes!: ElementRef;
    notes$: Observable<Note[]>;
    selectedNote: Note | null = null; // Initialize as null
    searchValue: string = '';
    dialogBoxOpen: boolean = false;
    labels: Label[] = [];
    searchLabelText: string = '';
    notesLength: number = 0;
    animationState: boolean = false;
    private labelListSubscription!: Subscription;
    private prevNotesLength = 0;

    constructor(public dialog: MatDialog, private noteService: NoteService) {
        this.notes$ = this.noteService.getNotes();
        this.labelListSubscription = this.noteService.getLabels().subscribe((labels: Label[]) => {
            this.labels = labels;
        });
    }

    ngOnInit(): void {
        this.subscribeToSearchData();
        this.animationState = false;
        this.notes$.subscribe(notes => {
            // Now, you can check the length of the array
            this.notesLength = notes.length;
            if (this.notesLength !== this.prevNotesLength) {
                this.prevNotesLength = this.notesLength;
                // Trigger your animation logic here
                this.onNotesLengthChange();
            }
        });

    }

    onNotesLengthChange(): void {

        if (this.notesLength > 1) {
            this.animationState = true;
        }
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

    handleMoreIconClick(event: MouseEvent, note: Note) {

        this.noteService.closeDropdownsExceptThisNote(note);
        note.showDropdown = !note.showDropdown;
        if (note.showLabelDropdown) {
            note.showLabelDropdown = !note.showLabelDropdown;
            this.searchLabelText = '';
        }
        event.stopPropagation();
    }

    isLabelsExist(note: Note): boolean {
        return note.labels.length > 0;
    }

    archiveNote(id: number) {
        this.notes$ = of(this.noteService.archiveNote(id)).pipe(switchMap(() => {
            return this.noteService.getNotes();
        }));
        this.selectedNote = null;
    }

    convertNewlinesToBreaks(text: string): string {
        return text.replace(/\n/g, '<br>');
    }

    UnArchiveNote(id: number) {
        this.notes$ = of(this.noteService.unArchiveNote(id)).pipe(switchMap((currentNotes) => {
            return this.noteService.getNotes();
        }));
        this.selectedNote = null;
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

    @HostListener('document:click', ['$event']) onDocumentClick(event: Event): void {

        const isClickInsideNote = this.notes?.nativeElement?.contains(event.target);
        if (this.notes && !isClickInsideNote) {
            this.notes$.forEach((notes) => {
                notes.forEach((note) => {
                    note.showDropdown = false;
                    note.showLabelDropdown = false;
                });
            });
        }
    }
    private subscribeToSearchData(): void {
        this.noteService.getSearchedData().subscribe((searchData) => {
            this.searchValue = searchData;
        });
    }
    ngOnDestroy(): void {
        if (this.labelListSubscription) {
            this.labelListSubscription.unsubscribe();
        }
    }
}


