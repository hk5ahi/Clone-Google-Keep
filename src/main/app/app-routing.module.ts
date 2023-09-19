import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  // Other top-level routes, if any...
  {
    path: '',
    loadChildren: () => import('../keep-container/keep-content/keep-content-routing.module').then(m => m.KeepContentRoutingModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
