import { Routes } from '@angular/router';
import { HomeModule } from './modules/home/home.module';
import { LayoutModule } from './modules/layout/layout.module';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => LayoutModule,
  }
];
