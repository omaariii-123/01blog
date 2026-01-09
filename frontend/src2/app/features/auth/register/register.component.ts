import { Component } from '@angular/core';
import { NavigationService } from '../../../core/nav/nav.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { User } from '../../../features/user/user.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css'
})
export class Register {
	registerForm = new FormGroup({
		name: new FormControl('', [Validators.required]),
		email: new FormControl('', [Validators.required, Validators.email]),
		password: new FormControl('', [Validators.required, Validators.minLength(8)]),
		confirmPassword: new FormControl('', [Validators.required]),
		terms: new FormControl(false, [Validators.requiredTrue])
	})

	constructor(public nav: NavigationService, public auth: AuthService) { }
	goLogin() {
		this.nav.goToLogin();
	}
	formValid() {
		return !this.registerForm.invalid && this.registerForm.get('password')?.value === this.registerForm.get('confirmPassword')?.value;
	}
	onSubmit() {
		if (!this.formValid()) return;
		let usr: User = {
			name: this.registerForm.get("name")?.value || '',
			email: this.registerForm.get("email")?.value || '',
			password: this.registerForm.get("password")?.value || '',
		};
		this.auth.register(usr)
	}

}
