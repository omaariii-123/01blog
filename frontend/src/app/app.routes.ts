import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { BlockComponent } from './block/block.component';
import { AdminComponent } from './admin/admin.component';
import { WriteComponent } from './write/write.component';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { adminGuard } from './admin.guard';
import { NotFound } from './not-found/not-found';
import { Router } from '@angular/router';

const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: HomeComponent, canActivate: [authGuard] }, // Home is protected
  { path: 'block/:username', component: BlockComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: 'write', component: WriteComponent, canActivate: [authGuard] },
  { path: '**', component: NotFound },
];
