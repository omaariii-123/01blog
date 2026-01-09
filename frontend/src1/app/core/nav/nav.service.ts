import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  constructor(private router: Router) {}
  goToLogin() {
    this.router.navigate(['/login']);
  }
  goToSignup() {
    this.router.navigate(['/register']);
  }
  goToHome() {
  	this.router.navigate(['/dash']);
  }
  goTo() {
  	this.router.navigate(['/']);
  }
}
