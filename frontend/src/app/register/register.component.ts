import { Component } from '@angular/core';
import {NavigationService} from '../services/nav.service';
@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class Register {
constructor(public nav: NavigationService){}
	goLogin() {
		this.nav.goToLogin();
	}

}
