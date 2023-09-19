import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {KeepContentComponent} from './keep-content.component';

import {KeepNotesArchiveComponent} from "./keep-notes-archive/keep-notes-archive.component";
import {KeepAddNotesComponent} from "./keep-add-notes/keep-add-notes.component";


const routes: Routes = [
  {
    path: '',
    component: KeepContentComponent,
    children: [
      {path: 'home', component: KeepAddNotesComponent},

      {path: 'archive', component: KeepNotesArchiveComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KeepContentRoutingModule {
}
