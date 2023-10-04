import { Component, ElementRef, HostListener, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Note } from "../../../Data Types/Note";
import { Observable, of, Subscription, switchMap } from "rxjs";
import { NoteService } from "../../../Service/note.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Label } from "../../../Data Types/Label";
import { EditorService } from "../../../Service/editor.service";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
    selector: 'app-keep-common-editor',
    templateUrl: './keep-common-editor.component.html',
    styleUrls: ['./keep-common-editor.component.scss'],
    animations: [
        trigger('fadeInLeft', [
            transition(':enter', [
                style({opacity: 0, transform: 'translateX(-100%)'}),
                animate('300ms ease-in', style({opacity: 1, transform: 'translateX(0)'})),
            ]),
        ]),
    ],

})
export class KeepCommonEditorComponent implements OnInit, OnDestroy {

    @Input() selectedNote!: Note | null;
    @ViewChild('formContainer') formContainer!: ElementRef;
    @ViewChild('secondForm') secondForm!: ElementRef;
    notes$: Observable<Note[]>;
    labels: Label[] = [];
    searchLabelText: string = '';
    private labelListSubscription!: Subscription;
    private clickCounter: number = 0;

    constructor(@Inject(MAT_DIALOG_DATA) public data: {
        Note: Note,
        dialogBoxOpen: boolean
    }, public dialogRef: MatDialogRef<KeepCommonEditorComponent>, private noteService: NoteService, private editorService: EditorService) {
        this.notes$ = this.noteService.getNotes();
        this.editorService.closeEditor$.subscribe(() => {
            this.closeEditor();
        });
    }

    ngOnInit(): void {
        this.notes$ = this.noteService.getNotes();
        this.notes$.subscribe((notes) => {
            if (Array.isArray(notes)) {
                this.notes$ = new Observable((observer) => {
                    observer.next(notes);
                    observer.complete();
                });
            }
        });
        this.dialogRef
            .afterClosed()
            .subscribe(() => {
                this.data.Note.showLabelDropdown = false;
                this.data.Note.showDropdown = false;
            });

    }

    handleMoreIconClick(event: MouseEvent, note: Note) {
        event.stopPropagation();
        note.showLabelDropdown = false;
        note.showDropdown = !note.showDropdown;
    }

    saveNoteChanges() {
        this.selectedNote = this.noteService.updateNote(this.data.Note);
    }

    UnArchiveNote(id: number) {
        this.notes$ = of(this.noteService.unArchiveNote(id));
        this.closeEditor();
        this.selectedNote = null;
    }

    archiveNote(id: number) {
        this.notes$ = of(this.noteService.archiveNote(id)).pipe(
            switchMap(() => {
                return this.noteService.getNotes();
            })
        );
        this.closeEditor();
        this.selectedNote = null;
    }

    adjustTextareaHeight(event: Event): void {
        const textarea = event.target as HTMLTextAreaElement;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    closeEditor() {
        this.saveNoteChanges();
        this.selectedNote = null;
        this.data.dialogBoxOpen = false;
        this.dialogRef.close();
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event): void {

        const isClickInsideNote = this.formContainer.nativeElement.contains(event.target);
        if (!isClickInsideNote && this.data.dialogBoxOpen) {
            if (this.clickCounter !== 0) {
                this.closeEditor();
            }
            this.clickCounter++;
        }
    }

    ngOnDestroy(): void {
        if (this.labelListSubscription) {
            this.labelListSubscription.unsubscribe();
        }
    }
}
