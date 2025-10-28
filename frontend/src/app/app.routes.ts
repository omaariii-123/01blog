import { Routes } from '@angular/router';
import { LandingPage} from './landingpage/landing-page.component';
//import { Dashboard} from './dashboard/dashboard.component';
import { Login} from './login/login.component';
import {Register} from './register/register.component';

export const routes: Routes = [
  { path: '', component: LandingPage },
 // { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: Login},
  { path: 'register', component: Register },
  { path: '**', redirectTo: '' } // fallback
];

