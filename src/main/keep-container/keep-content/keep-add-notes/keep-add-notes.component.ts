import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NoteService } from "../../../Service/note.service";
import { FooterService } from "../../../Service/footer.service";
import { Subscription } from "rxjs";


@Component({
  selector: 'app-keep-add-notes',
  templateUrl: './keep-add-notes.component.html',
  styleUrls: ['./keep-add-notes.component.scss'],

})
export class KeepAddNotesComponent implements OnInit,OnDestroy {
  @ViewChild('titleInput', {static: false}) titleInput!: ElementRef;
  @ViewChild('secondForm') secondFormElement!: ElementRef;
  @ViewChild('firstForm') firstFormElement!: ElementRef;
  private showFirstFormSubscription!: Subscription;
  showFirstForm!: boolean;
  showDropdownMenu: boolean = false;
  title: string = '';
  noteMessage: string = '';


  constructor(private noteService: NoteService, private footerService: FooterService) {
    this.showFirstFormSubscription = this.footerService.getShowFirstForm().subscribe((showFirstForm) => {
      this.showFirstForm = showFirstForm;
    });
  }

  ngOnInit(): void {
    this.showFirstForm = true;
  }

  getDropdownValue() {
    return this.footerService.getDropdownValue();
  }

  toggleForms() {

    this.showFirstForm = !this.showFirstForm; // Open the first form
    this.showDropdownMenu = false;
    this.addNote();
  }

  addNote() {
    if (this.title || this.noteMessage) {
      this.noteService.addNote(this.title, this.noteMessage);
      this.title = '';
      this.noteMessage = '';
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const isClickInsideFirstForm = this.isClickInsideElement(this.firstFormElement, event);
    const isClickInsideSecondForm = this.isClickInsideElement(this.secondFormElement, event);

    if (this.firstFormElement && !isClickInsideFirstForm) {
      this.showFirstForm = true;
    } else {
      this.showFirstForm = !this.showFirstForm;

      if (this.showFirstForm && !isClickInsideSecondForm) {
        this.showFirstForm = true;
        this.footerService.setDropdownMenu(false);
      } else if (isClickInsideSecondForm) {
        this.showFirstForm = false;
      }
    }

    if (this.showFirstForm) {
      this.addNote();
    }
  }

  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  focusTextarea(event: Event) {
    event.preventDefault();
    this.titleInput.nativeElement.blur();
    const textarea = document.querySelector('.note-text') as HTMLTextAreaElement;
    textarea.focus();
  }

  private isClickInsideElement(element: ElementRef | undefined, event: MouseEvent): boolean {
    return element?.nativeElement?.contains(event.target) || false;
  }

  ngOnDestroy(): void {
    if (this.showFirstFormSubscription) {
      this.showFirstFormSubscription.unsubscribe();
    }
  }

}
