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
  goToProfile(){
  	this.router.navigate(['/profile']);
  }
  goTo() {
  	this.router.navigate(['/']);
  }
}
