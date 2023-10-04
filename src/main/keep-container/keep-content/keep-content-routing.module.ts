import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeepContentComponent } from './keep-content.component';
import { KeepNotesArchiveComponent } from "./keep-notes-archive/keep-notes-archive.component";
import { KeepAddNotesComponent } from "./keep-add-notes/keep-add-notes.component";
import { KeepSearchComponent } from "./keep-search/keep-search.component";


const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: '',
        component: KeepContentComponent,
        children: [
            {path: 'home', component: KeepAddNotesComponent},
            {path: 'archive', component: KeepNotesArchiveComponent},
            {path: 'search', component: KeepSearchComponent},
        ]
    },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class KeepContentRoutingModule {
}
