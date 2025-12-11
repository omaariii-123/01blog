import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './core/auth/auth.service';
import { NavigationService } from './core/nav/nav.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('01Blog');
  constructor(public nav: NavigationService, public auth: AuthService) { }
  goLogin() {
    this.nav.goToLogin();
  }
  goSignUp() {
    this.nav.goToSignup();
  }
  goHome() {
    this.nav.goToHome();
  }
  goProfile() {
    this.nav.goToProfile();
  }
}
