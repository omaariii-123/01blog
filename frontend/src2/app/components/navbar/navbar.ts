import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MATERIAL_MODULES } from '../../shared/material';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, ...MATERIAL_MODULES],
  template: `
    <mat-toolbar color="primary" class="sticky-nav">
      <span class="logo">SocialBlock</span>
      
      <div class="nav-links">
        <button mat-button routerLink="/">Feed</button>
        <button mat-button routerLink="/profile">My Block</button>
        <button mat-button routerLink="/admin">Admin</button>
      </div>
      
      <span class="spacer"></span>
      
      <button mat-icon-button><mat-icon>search</mat-icon></button>
      <button mat-icon-button>
        <mat-icon matBadge="3" matBadgeColor="accent">notifications</mat-icon>
      </button>
      <button mat-icon-button routerLink="/profile" class="avatar-btn">
        <img src="https://i.pravatar.cc/150?img=12" alt="Me">
      </button>
    </mat-toolbar>
  `,
  styles: [`
    .sticky-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
    .logo { font-weight: 500; font-size: 1.2rem; }
    .nav-links { margin-left: 20px; display: none; }
    @media(min-width: 600px) { .nav-links { display: block; } }
    .avatar-btn img { width: 32px; height: 32px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.8); }
  `]
})
export class NavbarComponent {}
