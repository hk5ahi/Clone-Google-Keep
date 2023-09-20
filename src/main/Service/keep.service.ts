import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeepService {

  private isNotesSubject = new BehaviorSubject<boolean>(true);
  private isArchiveSubject = new BehaviorSubject<boolean>(false);

  isNotes$ = this.isNotesSubject.asObservable();
  isArchive$ = this.isArchiveSubject.asObservable();

  constructor() {
  }

  updateIsNotes() {
    this.isNotesSubject.next(true);
    this.isArchiveSubject.next(false);
  }

  updateIsArchive() {
    this.isNotesSubject.next(false);
    this.isArchiveSubject.next(true);
  }
}
