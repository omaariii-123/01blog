import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MATERIAL_MODULES } from '../../shared/material';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ...MATERIAL_MODULES],
  template: `
    <div class="auth-wrapper">
      <mat-card class="auth-card">
        <div class="text-center">
          <h2 style="color: #3f51b5;">Welcome Back</h2>
          <p style="color: #777;">Login to your block</p>
        </div>
        
        <form class="form-stack">
          <mat-form-field appearance="outline">
            <mat-label>Email Address</mat-label>
            <input matInput>
            <mat-icon matSuffix>email</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput type="password">
            <mat-icon matSuffix>lock</mat-icon>
          </mat-form-field>

          <button mat-raised-button color="primary" class="lg-btn" (click)="onLogin()">LOGIN</button>
        </form>
        
        <div class="text-center" style="margin-top: 15px;">
          <a routerLink="/register" style="color: #3f51b5; text-decoration: none;">Create an account</a>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-wrapper { height: 100vh; display: flex; justify-content: center; align-items: center; background-color: #f5f5f5; }
    .auth-card { width: 100%; max-width: 400px; padding: 32px; }
    .form-stack { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
    .lg-btn { padding: 8px 0; font-size: 16px; margin-top: 10px; }
  `]
})
export class LoginComponent {
  private router = inject(Router);

  onLogin() {
    this.router.navigate(['/']);
  }
}
