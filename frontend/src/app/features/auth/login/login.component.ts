import {CommonModule} from '@angular/common';
import {NavigationService} from '../../../core/nav/nav.service';
import {AuthService} from '../../../core/auth/auth.service';
import {Component, input} from '@angular/core';
import {FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import {User} from '../../user/user.model';
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class Login {
	loginForm = new FormGroup({
		email : new FormControl('', [Validators.required, Validators.email]),
		password : new FormControl('',[Validators.required, Validators.minLength(8)]),
	})
	constructor(public nav: NavigationService, private auth: AuthService){}
	goRegister() {
		this.nav.goToSignup();
	}
	formValid(){
		return !this.loginForm.invalid;
	}
	onSubmit(){
		let usr : User = {
			name :  '',
			email : this.loginForm.get("email")?.value || '',
			password : this.loginForm.get("password")?.value || '',
		};
		this.auth.login(usr);
	}
}
