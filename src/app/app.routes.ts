import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrganizationComponent } from './pages/organization/organization.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { UsermasterComponent } from './pages/usermaster/usermaster.component';
import { MenumasterComponent } from './pages/menumaster/menumaster.component';
export const routes: Routes = [

  // ✅ Default route → Login first
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ✅ Login (No Layout)
  { path: 'login', component: LoginComponent },

  // ✅ After login routes (With Layout)
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
      { path: 'organization', component: OrganizationComponent, canActivate: [authGuard] },
      { path: 'usermaster', component: UsermasterComponent, canActivate: [authGuard] },
      { path: 'menumaster', component: MenumasterComponent }
    ]
  },

  // ✅ If user enters wrong URL
  { path: '**', redirectTo: 'login' }

];
