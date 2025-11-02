// auth.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {User} from '../user/user.model';
import {NavigationService} from '../services/nav.service'
import {BehaviorSubject, catchError, tap, of} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  	user = signal<{name: String, email: String} | null | undefined>(undefined);
    constructor(private http: HttpClient, private nav: NavigationService) {}
	checkStatus(){
		return this.http.get("http://localhost:8080/api/users/status", {withCredentials: true} ).pipe(
			tap((user: any) => {
				this.user.set(user);
			}),
			catchError((err) => {
				console.log(err.message);
				return of(null);
			}
		));
	}
	register(user : User) {
		this.http.post<User>('http://localhost:8080/api/users/register', user).subscribe({
			next : (response) => {
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
	 this.http.post<User>('http://localhost:8080/api/users/login', body, { headers , withCredentials: true }).subscribe({
			next : (response) => {
					this.user.set(user);
					this.nav.goToHome();
			},
			error: (err) => {
				console.log(err.message);
			}

		});
  }
  logout() {
	this.http.post('http://localhost:8080/logout', { withCredentials: true }).subscribe({
		next : () => {
			this.user.set(null);
		},
		error : (err) => {
			console.log(err.message);
		}
	});
  }
}

