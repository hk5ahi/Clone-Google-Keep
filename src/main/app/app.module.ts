import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationBarComponent } from "../navigation-bar/navigation-bar.component";
import { KeepContainerComponent } from "../keep-container/keep-container.component";
import { KeepSideBarComponent } from "../keep-container/keep-side-bar/keep-side-bar.component";
import { KeepContentComponent } from "../keep-container/keep-content/keep-content.component";
import { KeepAddNotesComponent } from "../keep-container/keep-content/keep-add-notes/keep-add-notes.component";
import { KeepNotesComponent } from "../keep-container/keep-content/keep-notes/keep-notes.component";
import {
  KeepNotesArchiveComponent
} from "../keep-container/keep-content/keep-notes-archive/keep-notes-archive.component";
import { NoteService } from "../Service/note.service";
import { FormsModule } from "@angular/forms";
import { KeepService } from "../Service/keep.service";
import { KeepSearchComponent } from "../keep-container/keep-content/keep-search/keep-search.component";
import { SafeHtmlPipe } from "../Pipes/safeHtmlPipe";
import { KeepCommonNoteComponent } from "../keep-container/keep-content/keep-common-note/keep-common-note.component";
import {
  KeepCommonEditorComponent
} from "../keep-container/keep-content/keep-common-editor/keep-common-editor.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { KeepLabelModalComponent } from "../keep-container/keep-content/keep-label-modal/keep-label-modal.component";
import { LabelService } from "../Service/label.service";
import {
  KeepLabelDropdownComponent
} from "../keep-container/keep-content/keep-label-dropdown/keep-label-dropdown.component";


@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    KeepSideBarComponent,
    KeepContainerComponent,
    KeepContentComponent,
    KeepAddNotesComponent,
    KeepNotesComponent,
    KeepNotesArchiveComponent,
    KeepSearchComponent,
    SafeHtmlPipe,
    KeepCommonEditorComponent,
    KeepCommonNoteComponent,
    KeepLabelModalComponent,
    KeepLabelDropdownComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
  ],
  providers: [NoteService, KeepService, NavigationBarComponent, KeepCommonNoteComponent, LabelService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
