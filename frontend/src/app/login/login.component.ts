import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="split-screen">
      <!-- Left Side: Inspirational -->
      <div class="split-left">
        <div class="quote-container">
          <h1>"Document your journey, share your knowledge."</h1>
          <p>Join the community of developers learning together.</p>
        </div>
      </div>

      <!-- Right Side: Login Form -->
      <div class="split-right">
        <mat-card class="auth-card">
          <mat-card-header>
            <mat-card-title>Welcome Back</mat-card-title>
            <mat-card-subtitle>Sign in to continue your progress</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <form (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Username</mat-label>
                <input matInput [(ngModel)]="username" name="username" required placeholder="Enter your username">
                <mat-icon matSuffix>person</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Password</mat-label>
                <input matInput [type]="hidePassword() ? 'password' : 'text'" [(ngModel)]="password" name="password" required>
                <button mat-icon-button matSuffix type="button" (click)="hidePassword.set(!hidePassword())" [attr.aria-label]="'Hide password'" [attr.aria-pressed]="hidePassword()">
                  <mat-icon>{{hidePassword() ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
              </mat-form-field>

              <div class="error-message" *ngIf="errorMessage()">
                <mat-icon>error</mat-icon>
                <span>{{ errorMessage() }}</span>
              </div>

              <button mat-raised-button color="primary" class="submit-btn" type="submit" [disabled]="!username || !password || isLoading()">
                {{ isLoading() ? 'Signing in...' : 'Login' }}
              </button>
            </form>
          </mat-card-content>
          
          <mat-card-actions align="end">
            <p>New to 01Blog? <a routerLink="/register">Create an account</a></p>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .split-screen {
      display: flex;
      min-height: 100vh;
      width: 100vw;
    }

    .split-left {
      flex: 1;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      padding: 40px;
      position: relative;
      overflow: hidden;
    }

    .split-left::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80') no-repeat center center;
      background-size: cover;
      opacity: 0.1;
    }

    .quote-container {
      position: relative;
      z-index: 2;
      max-width: 500px;
      text-align: center;
    }

    .quote-container h1 {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      line-height: 1.2;
      color: white;
    }

    .quote-container p {
      font-size: 1.25rem;
      opacity: 0.9;
    }

    .split-right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--bg-color);
      padding: 20px;
    }

    .auth-card {
      width: 100%;
      max-width: 450px;
      padding: 32px 24px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .submit-btn {
      width: 100%;
      padding: 8px 0;
      font-size: 1.1rem;
      margin-top: 16px;
    }

    .error-message {
      color: var(--warn-color);
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      background: rgba(244, 67, 54, 0.1);
      padding: 8px 12px;
      border-radius: 4px;
    }

    mat-card-header {
      margin-bottom: 24px;
      text-align: center;
      display: block;
    }

    mat-card-title {
      font-size: 2rem;
      margin-bottom: 8px;
      display: block;
    }

    mat-card-subtitle {
      font-size: 1rem;
      display: block;
    }

    mat-card-actions {
      margin-top: 24px;
    }
    
    a {
      font-weight: 600;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  hidePassword = signal(true);
  errorMessage = signal('');
  isLoading = signal(false);

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    if (!this.username || !this.password) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        // Router navigation is handled in AuthService, but just in case or for extra logic
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.errorMessage.set('Invalid username or password. Please try again.');
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
}
