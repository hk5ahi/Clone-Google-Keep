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
  private STORAGE_KEY_LABELS = 'labels';

  constructor(private noteService: NoteService) {
    this.loadLabelsFromLocalStorage();
  }

  private loadLabelsFromLocalStorage(): void {
    const storedLabels = localStorage.getItem(this.STORAGE_KEY_LABELS);
    if (storedLabels) {
      this.labelListSubject.next(JSON.parse(storedLabels));
    }
  }

  private saveLabelsToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY_LABELS, JSON.stringify(this.labelListSubject.getValue()));
  }

  public get labelList(): Label[] {
    return this.labelListSubject.getValue();
  }

  public set labelList(value: Label[]) {
    this.labelListSubject.next(value);
    this.saveLabelsToLocalStorage();
  }

  addLabel(label: string, note?: Note) {
    if (label !== "") {
      const newLabel: Label = {
        id: this.labelList.length + 1,
        text: label,
        showCrossIcon: false
      };
      if (note) {
        note.labels = [...note.labels, newLabel];
        this.noteService.updateNote(note);
      }
      this.labelList = [...this.labelList, newLabel];
      this.noteService.setLabels(this.labelList);
    }
  }

  searchLabels(searchText: string): boolean {
    return this.labelList.some(label => label.text.toLowerCase().includes(searchText.toLowerCase()));
  }

}
