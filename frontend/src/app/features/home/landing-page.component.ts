import {Component} from '@angular/core';
import {NavigationService} from '../../core/nav/nav.service';

@Component({
	selector: 'app-landing-page',
	templateUrl: 'landing-page.component.html',
	styleUrls: ['landing-page.component.css'],
})

export class LandingPage {
	constructor(public nav : NavigationService) {}
	goRegister(){
		this.nav.goToSignup();
	}
}
