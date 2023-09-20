import { Component } from '@angular/core';
import { KeepService } from "../Service/keep.service";
import { Observable } from "rxjs";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {

  isNotes$ = this.keepService.isNotes$;
  isArchive$ = this.keepService.isArchive$;

  constructor(private keepService: KeepService) {
  }

  isNotes(): Observable<boolean> {
    return this.isNotes$;
  }

  isArchive(): Observable<boolean> {

    return this.isArchive$;
  }

  onSearch() {

  }

}
