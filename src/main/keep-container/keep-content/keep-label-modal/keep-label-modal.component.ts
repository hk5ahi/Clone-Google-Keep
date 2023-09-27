import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { Label } from "../../../Data Types/Label";
import { LabelService } from "../../../Service/label.service";
import { cloneDeep } from "lodash";

@Component({

  selector: 'app-keep-label-modal',
  templateUrl: './keep-label-modal.component.html',
  styleUrls: ['./keep-label-modal.component.scss']
})
export class KeepLabelModalComponent implements OnInit {

  showPlusIcon: boolean = true;
  showCrossIcon: boolean = false;
  showTickIcon: boolean = false;
  shouldAutofocus = false;
  label: string = "";
  labelList: Label[] = [];
  @ViewChild('labelInput') labelInput!: ElementRef;


  constructor(public dialogRef: MatDialogRef<KeepLabelModalComponent>, private labelService: LabelService) {
  }

  ngOnInit(): void {
    this.labelService.labelList$.subscribe(labels => {
      this.labelList = cloneDeep(labels); // Create a deep clone of the data
    });
  }

  closeModal() {
    this.dialogRef.close();
    this.dialogRef.afterClosed().subscribe(() => {

        if (this.label !== "") {
          this.labelService.addLabel(this.label);
        }
      }
    );
  }

  PlusIcon() {
    this.shouldAutofocus = false;
    this.showPlusIcon = true;
    this.showCrossIcon = false;
    this.showTickIcon = false;
  }

  showIcons() {

    this.shouldAutofocus = true;
    this.showPlusIcon = false;
    this.showCrossIcon = true;
    this.showTickIcon = true;
    this.labelService.updateLabelIcons();
    this.labelList = this.labelService.labelList;
  }

  saveLabel() {
    if (this.label !== "") {
      this.labelService.addLabel(this.label);
    }
    this.label = "";
  }

  updateLabel(label: Label) {
    if (label.text.trim() !== "") {
      this.labelService.updateLabel(label);
    }
    this.showPlusIcon = true;
    this.showCrossIcon = false;
    this.showTickIcon = false;
    label.showLabelIcon = true;
    label.showEditIcon = true;
    label.showDeleteIcon = false;
    label.showTickIcon = false;
    this.labelService.updateLabel(label);
  }

  hasLabel() {
    return this.labelList.length > 0;
  }

  onMouseEnter(label: Label) {
    if (!label.showTickIcon) {
      label.showLabelIcon = false;
      label.showDeleteIcon = true;
    }
  }

  deleteLabel(label: Label) {
    this.labelService.deleteLabel(label);
  }

  showTickButton(label: Label, inputElement: HTMLInputElement) {

    this.labelService.updateLabelIcons();
    this.labelList = this.labelService.labelList;
    label.showTickIcon = true;
    label.showEditIcon = false;
    label.showDeleteIcon = true;
    label.showLabelIcon = false;
    this.showPlusIcon = true;
    this.showCrossIcon = false;
    this.showTickIcon = false;

    if (inputElement) {
      inputElement.select();
    }
  }

  onMouseLeave(label: Label) {
    if (!label.showTickIcon) {
      label.showLabelIcon = true;
      label.showDeleteIcon = false;
    }
  }

  tickIcon(label: Label) {
    label.showTickIcon = true;
    label.showEditIcon = false;

  }


}
