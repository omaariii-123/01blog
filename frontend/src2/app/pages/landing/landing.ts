import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MATERIAL_MODULES } from '../../shared/material';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, ...MATERIAL_MODULES],
  template: `
    <div class="hero">
      <div class="hero-content">
        <h1>Welcome to SocialBlock</h1>
        <p>Connect, share, and manage your personal block in real-time.</p>
        <div class="btns">
          <button mat-raised-button color="accent" routerLink="/register" class="hero-btn">Get Started</button>
          <button mat-stroked-button class="hero-btn outline" routerLink="/login">Login</button>
        </div>
      </div>
    </div>

    <div class="features container">
      <mat-card class="f-card">
        <mat-icon color="primary" class="big-icon">rss_feed</mat-icon>
        <h3>Real-time Feed</h3>
      </mat-card>
      <mat-card class="f-card">
        <mat-icon color="primary" class="big-icon">security</mat-icon>
        <h3>Secure Privacy</h3>
      </mat-card>
      <mat-card class="f-card">
        <mat-icon color="primary" class="big-icon">photo_library</mat-icon>
        <h3>Rich Media</h3>
      </mat-card>
    </div>
  `,
  styles: [`
    .hero { height: 70vh; background: linear-gradient(135deg, #3f51b5 0%, #ff4081 100%); color: white; display: flex; align-items: center; justify-content: center; text-align: center; clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%); }
    .hero h1 { font-size: 3.5rem; margin-bottom: 1rem; }
    .hero p { font-size: 1.5rem; opacity: 0.9; margin-bottom: 2rem; }
    .btns { gap: 15px; display: flex; justify-content: center; }
    .hero-btn { margin: 0 10px; padding: 0 30px; height: 45px; }
    .outline { border-color: white; color: white; }
    .features { display: flex; gap: 20px; margin-top: -60px; position: relative; z-index: 2; }
    .f-card { flex: 1; text-align: center; padding: 30px; }
    .big-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 15px; }
  `]
})
export class LandingComponent {}
