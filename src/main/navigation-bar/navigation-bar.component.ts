import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { KeepService } from "../Service/keep.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

import { NoteService } from "../Service/note.service";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {

  isNotes$ = this.keepService.isNotes$;
  isArchive$ = this.keepService.isArchive$;
  searchData: string = '';

  constructor(private keepService: KeepService, private renderer: Renderer2, private el: ElementRef, private router: Router, private noteService: NoteService) {
  }

  isNotes(): Observable<boolean> {
    return this.isNotes$;
  }

  isArchive(): Observable<boolean> {
    return this.isArchive$;
  }

  searchDataExist(): boolean {
    return this.searchData != '';

  }

  clearData() {
    this.searchData = '';
    const inputElement = this.el.nativeElement.querySelector('input');
    if (inputElement) {
      this.renderer.selectRootElement(inputElement).focus();
    }
    this.router.navigate(['home']);
  }

  onSearchDataChange(newValue: string) {
    if (newValue.trim() !== '') {

      this.router.navigate(['search']);
    }
    this.noteService.notesExist(newValue);

  }

  ngOnInit(): void {
    this.noteService.getSearchedData().subscribe((searchData) => {
      this.searchData = searchData;
    });
  }


}



