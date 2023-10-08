import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FooterService {
  private showDropdownMenuSubject = new BehaviorSubject<boolean>(false);

  private showFirstFormSubject = new BehaviorSubject<boolean>(false);
  showFirstForm$ = this.showFirstFormSubject.asObservable();
  private searchLabelSubject = new BehaviorSubject<string>(''); // Initial value is an empty string
  searchLabel$: Observable<string> = this.searchLabelSubject.asObservable();
  toggleDropdownMenu() {
    this.showDropdownMenuSubject.next(!this.showDropdownMenuSubject.value);
  }

  setDropdownMenu(value: boolean) {
    this.showDropdownMenuSubject.next(value);
  }
  setSearchLabel(searchLabelText: string): void {
    this.searchLabelSubject.next(searchLabelText);
  }

  setShowFirstForm(value: boolean) {
    this.showFirstFormSubject.next(value);
  }

  getDropdownValue() {
    return this.showDropdownMenuSubject.value;
  }

  getShowFirstForm(): Observable<boolean> {
    return this.showFirstForm$; // Return the Observable directly
  }
}
