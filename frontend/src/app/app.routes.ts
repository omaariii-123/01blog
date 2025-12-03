import { Routes } from '@angular/router';
import { LandingPage} from './features/home/landing-page.component';
import { Dash} from './features/user/dash/dash';
import { Login} from './features/auth/login/login.component';
import {Register} from './features/auth/register/register.component';
import {authGuard} from './core/auth/auth-guard';
import {loginGuard} from './core/auth/login-guard';
import { ProfileComponent } from './features/user/profile/profile'; 

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'dash', component: Dash, canActivate: [authGuard]},
  { path: 'login', component: Login, canActivate: [loginGuard]},
  { path: 'register', component: Register, canActivate: [loginGuard]},
  { path: 'profile', component: ProfileComponent, }, // fallback
  { path: '**', redirectTo: '' } // fallback
];

