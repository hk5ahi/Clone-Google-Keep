import {Component, ElementRef, Input, OnDestroy, Renderer2, ViewChild} from '@angular/core';
import { Note } from "../../../Data Types/Note";
import { Label } from "../../../Data Types/Label";
import { LabelService } from "../../../Service/label.service";
import { NoteService } from "../../../Service/note.service";
import { Subscription } from "rxjs";
import { AppConstants } from "../../../Constants/app-constant";
import {FooterService} from "../../../Service/footer.service";

@Component({
  selector: 'app-keep-label-dropdown',
  templateUrl: './keep-label-dropdown.component.html',
  styleUrls: ['./keep-label-dropdown.component.scss']
})
export class KeepLabelDropdownComponent implements OnDestroy {

  @ViewChild('labelSearchText') labelSearchText!: ElementRef;
  @ViewChild('labelArea') labelArea!: ElementRef;
  @Input() note!: Note;
  @Input() searchLabelText: string = '';
  @Input() labelDropdown: boolean=false;
  @Input() DialogBoxOpen!: boolean;
  @Input() selectedNote!: Note | null; // Initialize as null
  labels: Label[] = [];
  private labelListSubscription!: Subscription;

  constructor(private labelService: LabelService, private noteService: NoteService,private footerService:FooterService,private renderer: Renderer2) {
    this.labelListSubscription = this.noteService.getLabels().subscribe((labels: Label[]) => {
      this.labels = labels;
      this.footerService.searchLabel$.subscribe((searchLabelText) => {
        this.searchLabelText = searchLabelText;
      });
    });
  }

  isLabelsExist(note: Note): boolean {
    return note.labels.length > 0;
  }

  addLabel(text: string, note: Note) {
    this.labelService.addLabel(text, note);
    this.searchLabelText = '';
  }

  stopEvent(event: Event) {
    event.stopPropagation();
  }

  toggleCheckBox(note: Note, Label: Label) {
    this.noteService.toggleCheckBox(note, Label);
  }

  getCheckBox(note: Note, labelToFind: Label): boolean {
    const foundLabel = note.labels.find(label => label.id === labelToFind.id);
    return !!foundLabel;
  }

  getDynamicHeight(): string {
    const numberOfLabels = this.labels.length;
    // Fetch the total height of the label dropdown from AppConstants
    const totalHeight = (numberOfLabels * AppConstants.heightPerLabel) + AppConstants.additionalHeight;
    return `${totalHeight}px`;
  }
  adjustSearchHeight() {

    // Get the native element of the Search Area
    const searchAreaElement = this.labelSearchText?.nativeElement;
    const labelAreaNativeElement = this.labelArea?.nativeElement;

    if (searchAreaElement) {
      // Check if the content overflows (i.e., it wraps to a new line)
      const contentOverflows = searchAreaElement.scrollHeight > searchAreaElement.clientHeight;

      // Calculate the desired height based on content overflow
      const desiredHeight = contentOverflows
        ? searchAreaElement.scrollHeight + AppConstants.oneEM  // Increase height by 1em (16px)
        : searchAreaElement.clientHeight;
      // Set the height of the element
      this.renderer.setStyle(labelAreaNativeElement, 'height', `${desiredHeight}px`);
    }
  }

  searchLabels(searchText: string): boolean {
    return this.labelService.searchLabels(searchText);
  }

  // Purpose: Unsubscribe the subscription to avoid memory leak.
  ngOnDestroy(): void {
    if (this.labelListSubscription) {
      this.labelListSubscription.unsubscribe();
    }
  }


}
