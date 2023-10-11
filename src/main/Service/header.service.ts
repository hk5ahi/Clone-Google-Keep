import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private isNotesSubject = new BehaviorSubject<boolean>(true);
  isNotes$ = this.isNotesSubject.asObservable();
  private isArchiveSubject = new BehaviorSubject<boolean>(false);
  isArchive$ = this.isArchiveSubject.asObservable();

  updateIsNotes() {
    this.isNotesSubject.next(true);
    this.isArchiveSubject.next(false);
  }

  updateIsArchive() {
    this.isNotesSubject.next(false);
    this.isArchiveSubject.next(true);
  }
}
