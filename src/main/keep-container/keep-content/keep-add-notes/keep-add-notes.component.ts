import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NoteService } from "../../../Service/note.service";
import { FooterService } from "../../../Service/footer.service";
import { Subscription } from "rxjs";
import { AppConstants } from "../../../Constants/app-constant";

@Component({
  selector: 'app-keep-add-notes',
  templateUrl: './keep-add-notes.component.html',
  styleUrls: ['./keep-add-notes.component.scss'],

})
export class KeepAddNotesComponent implements OnInit, OnDestroy {
  @ViewChild('titleInput', {static: false}) titleInput!: ElementRef;
  @ViewChild('secondForm') secondFormElement!: ElementRef;
  @ViewChild('firstForm') firstFormElement!: ElementRef;
  @ViewChild('form') FormElement!: ElementRef;
  @ViewChild('textInput') textInput!: ElementRef;
  showFirstForm!: boolean;
  showDropdownMenu: boolean = false;
  title: string = '';
  noteMessage: string = '';
  addAndArchiveClicked!: boolean;
  private showFirstFormSubscription!: Subscription;

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

  setFocus() {
    setTimeout(() => {
      this.textInput.nativeElement.focus();
    }, 1);
  }

  toggleForms() {

    this.showFirstForm = !this.showFirstForm; // Open the first form
    this.showDropdownMenu = false;
    this.addNote();
  }

  addNote() {
    // if title and noteMessage is not empty string or null refactored it from title!='' to title and noteMessage!='' to noteMessage
    if (this.title || this.noteMessage) {
      this.noteService.addNote(this.title, this.noteMessage);
      this.title = '';
      this.noteMessage = '';
    }
  }

  // Purpose: To close the second form when clicked outside the form.
  // Refactored and remove the unnecessary code like clickCounter
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

    if (this.showFirstForm && !this.addAndArchiveClicked) {
      this.addNote();
    }
  }

  focusTextarea(event: Event) {
    event.preventDefault();
    this.titleInput?.nativeElement.blur();
    const textarea = document.querySelector('.note-text') as HTMLTextAreaElement;
    textarea.focus();
  }

  showScrollbar(): boolean {
    const container = this.secondFormElement?.nativeElement?.querySelector('.note-text');
    if (container) {
      const maxHeight = window.innerHeight - container.getBoundingClientRect().top; // Adjust as needed
      container.style.maxHeight = `${maxHeight}px`;
      const actualHeight = container.clientHeight;

      return actualHeight > AppConstants.maxHeightOFNoteText;
    }
    return false; // Return false by default if container is not found
  }

  stopEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  handleAddAndArchive(value: boolean) {
    this.addAndArchiveClicked = value;
  }

  adjustTitleHeight(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';
    this.adjustTopPositionTitle();
    this.adjustParentContainerHeight();
  }

  adjustTextHeight(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const newTextHeight = Math.max(target.scrollHeight, AppConstants.minimumNoteTextHeight);

    // If there is already newline in the note, increase the height of the note title by 10px
    const additionalTitleHeight = this.textInput.nativeElement.height > AppConstants.minimumNoteTitleHeight ? 10 : 0;
    target.style.height = 'auto';
    target.style.height = `${newTextHeight}px`;

    // Increase the height of the note title
    const titleInput = this.titleInput.nativeElement;
    titleInput.style.height = 'auto';
    titleInput.style.height = `${titleInput.scrollHeight + additionalTitleHeight}px`;
    this.adjustTopPositionText();
    this.adjustParentContainerHeight();
    if (titleInput.style.height == AppConstants.minimumNoteTitleHeight + 'px') {
      titleInput.style.top = `${AppConstants.addTop}px`;
    }
  }

  adjustParentContainerHeight(): void {
    const parentContainer = this.secondFormElement.nativeElement;
    const newTitleHeight = this.titleInput.nativeElement.scrollHeight;
    const newTextHeight = this.textInput.nativeElement.scrollHeight;

    if (newTitleHeight > AppConstants.minimumNoteTitleHeight || newTextHeight > AppConstants.addNoteTextHeight) {
      parentContainer.style.height = `${newTitleHeight + newTextHeight + AppConstants.addNoteTop}px`;
    } else if (newTitleHeight == AppConstants.minimumNoteTitleHeight) {

      this.textInput.nativeElement.style.top = '-5px';

    } else if (newTextHeight == AppConstants.addNoteTextHeight) {

      this.titleInput.nativeElement.style.top = '32px';
    }
  }

  adjustTopPositionTitle(): void {
    const titleInput = this.titleInput.nativeElement;
    const newTitleHeight = titleInput.scrollHeight;
    const textInput = this.textInput.nativeElement;
    const newTextHeight = textInput.scrollHeight;
    const maxTopPosition = 6; // Maximum allowed top position
    const totalHeight = newTitleHeight + newTextHeight;
    textInput.style.top = `${totalHeight > AppConstants.addNoteTitleHeight ? Math.min(maxTopPosition, 6) : -4}px`;
  }

  adjustTopPositionText(): void {
    const titleInput = this.titleInput.nativeElement;
    const newTitleHeight = titleInput.scrollHeight;
    const textInput = this.textInput.nativeElement;
    const newTextHeight = textInput.scrollHeight;
    const topPosition = newTextHeight > AppConstants.addNoteTextHeight ? 2 : -4;
    textInput.style.top = `${newTitleHeight > AppConstants.addNoteTitleHeight ? Math.min(topPosition, 6) : -4}px`;
  }
  private isClickInsideElement(element: ElementRef | undefined, event: MouseEvent): boolean {
    return element?.nativeElement?.contains(event.target) || false;
  }
  // Purpose: Unsubscribe the subscription to avoid memory leak.
  ngOnDestroy(): void {
    if (this.showFirstFormSubscription) {
      this.showFirstFormSubscription.unsubscribe();
    }
  }
}
