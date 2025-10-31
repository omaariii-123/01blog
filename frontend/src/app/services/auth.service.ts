// auth.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {User} from '../user/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  	user = signal<boolean | null>(null);
    constructor(private http: HttpClient) {}
	register(user : User) {
		let res : boolean = false;
		try {
		this.http.post<User>('http://localhost:8080/api/users/register', user).subscribe({
			next : (response) => {
					console.log(response);
			}		
		});
		
		}catch (err) {
				console.log(err);
		}
	}
   login(user: User) {
	try {
	 this.http.post<User>('http://localhost:8080/api/users/login', user, { withCredentials: true }).subscribe({
			next : (response) => {
					console.log(response);
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

