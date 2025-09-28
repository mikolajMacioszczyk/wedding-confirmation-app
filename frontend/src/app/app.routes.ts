import { Routes } from '@angular/router';
import { ConfirmationComponent } from './components/confirmation.component';
import { HomeComponent } from './components/home.component';
import { AdminLayoutComponent } from './components/admin/admin-layout.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard.component';
import { AdminInvitationsComponent } from './components/admin/admin-invitations.component';
import { AdminPersonsComponent } from './components/admin/admin-persons.component';
import { AdminDrinkTypesComponent } from './components/admin/admin-drink-types.component';
import { AdminConfirmationsComponent } from './components/admin/admin-confirmations.component';

export const routes: Routes = [
  { path: 'potwierdz/:publicId', component: ConfirmationComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'invitations', component: AdminInvitationsComponent },
      { path: 'persons', component: AdminPersonsComponent },
      { path: 'drink-types', component: AdminDrinkTypesComponent },
      { path: 'confirmations', component: AdminConfirmationsComponent }
    ]
  },
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Wildcard route to home
];
