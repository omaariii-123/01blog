import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationService} from '../services/nav.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class Login {
	constructor(public nav: NavigationService){}
	goRegister() {
		this.nav.goToSignup()
	}
}
