import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-keep-label-modal',
  templateUrl: './keep-label-modal.component.html',
  styleUrls: ['./keep-label-modal.component.scss']
})
export class KeepLabelModalComponent {

  showPlusIcon: boolean = true;
  showCrossIcon: boolean = false;
  showTickIcon: boolean = false;
  shouldAutofocus = false;
  @ViewChild('labelInput') labelInput!: ElementRef;
  constructor(public dialogRef: MatDialogRef<KeepLabelModalComponent>) {
  }
  closeModal() {
    this.dialogRef.close();
  }
  showIcons() {
    this.shouldAutofocus = true;
    this.showPlusIcon = false;
    this.showCrossIcon = true;
    this.showTickIcon = true;
  }


}
