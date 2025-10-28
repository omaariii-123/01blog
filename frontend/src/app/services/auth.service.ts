// auth.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // null = not logged in, or store user info
  user = signal<string | null>(null);

  login(username: string) {
    // store user info / token here
    this.user.set(username);
  }

  logout() {
    this.user.set(null);
  }

  isLoggedIn() {
    return !!this.user();
  }
}

