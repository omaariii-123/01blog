// auth.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {User} from '../user/user.model';
import {NavigationService} from '../services/nav.service'

@Injectable({ providedIn: 'root' })
export class AuthService {
  	user = signal<boolean | null>(null);
    constructor(private http: HttpClient, private nav: NavigationService) {}
	register(user : User) {
		let res : boolean = false;
		try {
		this.http.post<User>('http://localhost:8080/api/users/register', user).subscribe({
			next : (response) => {
					console.log(response);
					this.nav.goToLogin();
			}		
		});
		
		}catch (err) {
				console.log(err);
		}
	}
   login(user: User) {
	try {
		const headers = new HttpHeaders({
      		'Content-Type': 'application/x-www-form-urlencoded'
    	});
		let body = new URLSearchParams();
		body.set('email', user.email);
		body.set('password', user.password);
	 this.http.post<User>('http://localhost:8080/api/users/login', body, { headers , withCredentials: true }).subscribe({
			next : (response) => {
					console.log(response);
					this.user.set(true);
					this.nav.goToHome();
			}
		});

	}catch(err) {
		console.log(err);
	}

	
  }

  logout() {
    this.user.set(null);
  }

  isLoggedIn() {
    return this.user();
  }
}

