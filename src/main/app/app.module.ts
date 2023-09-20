import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { KeepContainerComponent } from '../keep-container/keep-container.component';
import { KeepSideBarComponent } from '../keep-container/keep-side-bar/keep-side-bar.component';
import { KeepContentComponent } from '../keep-container/keep-content/keep-content.component';
import { KeepAddNotesComponent } from '../keep-container/keep-content/keep-add-notes/keep-add-notes.component';
import { KeepNotesComponent } from '../keep-container/keep-content/keep-notes/keep-notes.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    KeepSideBarComponent,
    KeepContainerComponent,
    KeepContentComponent,
    KeepAddNotesComponent,
    KeepNotesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
