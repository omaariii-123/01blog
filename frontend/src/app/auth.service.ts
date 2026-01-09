import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface AuthResponse {
    token: string;
}

export interface RegisterRequest {
    username?: string;
    password?: string;
}

export interface AuthRequest {
    username?: string;
    password?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/api/v1/auth';
    private tokenKey = '01blog_token';

    currentUser = signal<string | null>(this.getUsernameFromToken());

    constructor(private http: HttpClient, private router: Router) { }

    register(request: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
            tap(response => this.handleSuccess(response))
        );
    }

    login(request: AuthRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/authenticate`, request).pipe(
            tap(response => this.handleSuccess(response))
        );
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    private handleSuccess(response: AuthResponse) {
        localStorage.setItem(this.tokenKey, response.token);
        this.currentUser.set(this.getUsernameFromToken());
        this.router.navigate(['/']);
    }

    private getUsernameFromToken(): string | null {
        const token = localStorage.getItem(this.tokenKey);
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.sub;
        } catch (e) {
            return null;
        }
    }
    isAdmin(): boolean {
        const role = this.getRoleFromToken();
        return role === 'ADMIN';
    }

    private getRoleFromToken(): string | null {
        const token = localStorage.getItem(this.tokenKey);
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role;
        } catch (e) {
            return null;
        }
    }
}
