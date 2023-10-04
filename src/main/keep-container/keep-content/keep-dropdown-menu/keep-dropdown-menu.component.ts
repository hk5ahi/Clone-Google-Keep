import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Note } from "../../../Data Types/Note";
import { Label } from "../../../Data Types/Label";
import { Observable, of, Subscription } from "rxjs";
import { NoteService } from "../../../Service/note.service";
import { LabelService } from "../../../Service/label.service";
import { EditorService } from "../../../Service/editor.service";


@Component({
    selector: 'app-keep-dropdown-menu',
    templateUrl: './keep-dropdown-menu.component.html',
    styleUrls: ['./keep-dropdown-menu.component.scss'],
})

export class KeepDropdownMenuComponent implements OnInit, OnDestroy {
    @Input() note!: Note;
    @Input() selectedNote!: Note | null;
    @Input() OpenDialogue!: boolean;
    notes$: Observable<Note[]>;
    labels: Label[] = [];
    private labelListSubscription!: Subscription;

    constructor(private noteService: NoteService, private labelService: LabelService, private editorService: EditorService) {
        this.labelListSubscription = this.noteService.getLabels().subscribe((labels: Label[]) => {
            this.labels = labels;
        });
        this.notes$ = this.noteService.getNotes();
    }

    ngOnInit(): void {
        this.subscribeToNotes();
        this.editorService.closeEditor$.subscribe(() => {
            // Call the closeEditor() function in response to the service event

        });
    }

    hasLabels(note: Note) {
        this.labelListSubscription = this.labelService.labelList$.subscribe((labels: Label[]) => {
            this.labels = labels;
        });
        return note.labels.length > 0;
    }

    isLabelsExist(note: Note): boolean {
        return note.labels.length > 0;
    }

    deleteNote(event: Event, id: number) {
        event.stopPropagation();
        this.noteService.deleteNote(id).subscribe((updatedNotes) => {
            this.notes$ = of(updatedNotes);
        });
        this.editorService.closeEditor();
    }

    showLabelDropdown(event: Event, note: Note) {
        event.stopPropagation();
        note.showDropdown = !note.showDropdown;
        note.showLabelDropdown = !note.showLabelDropdown;
    }

    ngOnDestroy(): void {
        if (this.labelListSubscription) {
            this.labelListSubscription.unsubscribe();
        }
    }

    private subscribeToNotes(): void {
        this.noteService.getNotes().subscribe((notes) => {
            if (Array.isArray(notes)) {
                this.notes$ = new Observable((observer) => {
                    observer.next(notes);
                    observer.complete();
                });
            }
        });
    }


}
