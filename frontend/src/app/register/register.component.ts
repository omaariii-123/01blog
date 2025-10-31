import { Component } from '@angular/core';
import {NavigationService} from '../services/nav.service';
import {FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {User} from '../user/user.model';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class Register {
registerForm = new FormGroup({
		name : new FormControl('', [Validators.required]),
		email : new FormControl('', [Validators.required, Validators.email]),
		password : new FormControl('',[Validators.required, Validators.minLength(8)]),
	})

constructor(public nav: NavigationService, public auth: AuthService){}
	goLogin() {
		this.nav.goToLogin();
	}
	formValid(){
		return !this.registerForm.invalid;
	}
	onSubmit(){
		let usr : User = {
			name : this.registerForm.get("name")?.value || '',
			email : this.registerForm.get("email")?.value || '',
			password : this.registerForm.get("password")?.value || '',
		};
		this.auth.register(usr)	
	}

}
