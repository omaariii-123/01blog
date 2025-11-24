import { Routes } from '@angular/router';
import { LandingPage} from './landingpage/landing-page.component';
import { Dash} from './dash/dash';
import { Login} from './login/login.component';
import {Register} from './register/register.component';
import {authGuard} from './auth-guard';
import {loginGuard} from './login-guard';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'dash', component: Dash, canActivate: [authGuard]},
  { path: 'login', component: Login, canActivate: [loginGuard]},
  { path: 'register', component: Register , canActivate: [loginGuard]},
  { path: '**', redirectTo: '' } // fallback
];

