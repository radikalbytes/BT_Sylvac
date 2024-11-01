import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';import { LayoutComponent } from './layout.component';
import { HomeModule } from '../home/home.module';
;

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => HomeModule
      },
      {
        path: '**',
        redirectTo: ''
      }
    ],
  },
  {
    path: '**',
    redirectTo: ''
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
