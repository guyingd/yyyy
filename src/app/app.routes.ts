import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { AdminComponent } from './components/admin/admin.component';
import { AboutComponent } from './components/about/about.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];
