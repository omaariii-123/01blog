import { Injectable, signal, effect, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../../features/user/user.model';
import { NavigationService } from '../nav/nav.service'
import { catchError, tap, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
	user = signal<{ name: String, email: String, id?: number } | null | undefined>(undefined);
	state = computed(() => this.user());

	constructor(private http: HttpClient, private nav: NavigationService) {
		effect(() => {
			if (this.state() === null) {
				this.nav.goToLogin();
			} else if (this.state() === undefined) {
				// Initial state, maybe do nothing or redirect to home/login based on guard
				// The previous code had this.nav.goTo() which seems incomplete/undefined
			}
		})
	}
	checkStatus() {
		return this.http.get("http://localhost:8080/api/users/status", { withCredentials: true }).pipe(
			tap((user: any) => {
				console.log(user);
				this.user.set({ name: user.name, email: user.email, id: user.id });
			}),
			catchError((err) => {
				console.log(err.message);
				return of(null);
			}
			));
	}
	register(user: User) {
		this.http.post<User>('http://localhost:8080/api/users/register', user).subscribe({
			next: (response) => {
				this.nav.goToLogin();
			},
			error: (err) => {
				console.log(err.message);
			}
		});

	}
	login(user: User) {
		const headers = new HttpHeaders({
			'Content-Type': 'application/x-www-form-urlencoded'
		});
		let body = new URLSearchParams();
		body.set('email', user.email);
		body.set('password', user.password);
		this.http.post<User>('http://localhost:8080/api/users/login', body, { headers, withCredentials: true }).subscribe({
			next: (user) => {
				this.user.set(user);
				this.nav.goToHome();
			},
			error: (err) => {
				console.log(err.message);
				// Fixed: Do not set user on error
			}

		});
	}
	logout() {
		this.http.post('/api/users/logout', {}, { withCredentials: true }).subscribe({
			next: (res) => {
				console.log(res);
				this.user.set(null);
			},
			error: (err) => {
				console.log(err.message);
			}
		});
	}
}

