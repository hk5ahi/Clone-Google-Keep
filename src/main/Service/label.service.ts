import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Label } from '../Data Types/Label';
import { Note } from "../Data Types/Note";

@Injectable({
  providedIn: 'root'
})
export class LabelService {

  private labelListSubject: BehaviorSubject<Label[]> = new BehaviorSubject<Label[]>([]);
  labelList$ = this.labelListSubject.asObservable();

  constructor() {
  }

  public get labelList(): Label[] {
    return this.labelListSubject.getValue();
  }

  public set labelList(value: Label[]) {
    this.labelListSubject.next(value);
  }

  addLabel(label: string, note?: Note) {
    if (label !== "") {
      const newLabel: Label = {
        id: this.labelList.length + 1,
        text: label,
        showLabelIcon: true,
        showEditIcon: true,
        showDeleteIcon: false,
        showTickIcon: false,

      };
      if (note) {
        note.labels.push(newLabel);
      }
      this.labelList = [...this.labelList, newLabel];
    }
  }

  updateLabelIcons() {
    this.labelList.forEach(label => {
      label.showLabelIcon = true;
      label.showEditIcon = true;
      label.showDeleteIcon = false;
      label.showTickIcon = false;
    });
    console.log(this.labelList);
  }

  searchLabels(searchText: string): boolean {

    this.labelList.forEach(label => {
      return label.text.toLowerCase().includes(searchText.toLowerCase());
    });
    return false;
  }

  deleteLabel(label: Label) {
    const index = this.labelList.findIndex(l => l.id === label.id);
    this.labelList.splice(index, 1);
    this.labelList = [...this.labelList];
  }

  updateLabel(label: Label) {
    if (label.text !== "") {

      const index = this.labelList.findIndex(l => l.id === label.id);
      if (label.text.trim() === "") {
        let text = this.labelList[index].text;
        this.labelList[index] = label;
        this.labelList[index].text = text;
        this.labelList = [...this.labelList];
      } else {
        this.labelList[index] = label;
        this.labelList = [...this.labelList];
      }
    }

  }
}
