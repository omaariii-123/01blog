import { Component } from '@angular/core';
import { NavigationService } from '../../core/nav/nav.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-landing-page',
	standalone: true,
	imports: [MatButtonModule, MatCardModule, MatIconModule],
	templateUrl: 'landing-page.component.html',
	styleUrls: ['landing-page.component.css'],
})

export class LandingPage {
	constructor(public nav: NavigationService) { }
	goRegister() {
		this.nav.goToSignup();
	}
}
