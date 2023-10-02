import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Label } from '../Data Types/Label';
import { Note } from "../Data Types/Note";
import { NoteService } from "./note.service";

@Injectable({
  providedIn: 'root'
})
export class LabelService {

  private labelListSubject: BehaviorSubject<Label[]> = new BehaviorSubject<Label[]>([]);
  labelList$ = this.labelListSubject.asObservable();

  constructor(private noteService: NoteService) {
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
        showCheckbox: true,
        showCrossIcon: false
      };

      if (note) {
        note.labels.push(newLabel);
      }
      this.labelList = [...this.labelList, newLabel];
      this.noteService.setLabels(this.labelList);
    }
  }

  updateLabelIcons() {
    this.labelList.forEach(label => {
      label.showLabelIcon = true;
      label.showEditIcon = true;
      label.showDeleteIcon = false;
      label.showTickIcon = false;
    });
  }

  searchLabels(searchText: string): boolean {
    return this.labelList.some(label => label.text.toLowerCase().includes(searchText.toLowerCase()));
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
